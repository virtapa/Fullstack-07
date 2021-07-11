import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const blogFromRef = useRef()

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)

      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setMessage(null)
    }, 3000)
  }, [message])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setUsername('')
      setPassword('')
      setMessage({
        text: 'wrong username or password',
        type: 'error',
      })
    }
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFromRef.current.toggleVisibility()
      const response = await blogService.create(blogObject)
      setBlogs(blogs.concat(response))
      setMessage({
        text: 'a new blog added',
        type: 'success',
      })
    } catch (exception) {
      setMessage({
        text: `${exception}`,
        type: 'error',
      })
    }
  }

  const handleLikes = async (id, likes) => {
    await blogService.update({
      id: id,
      likes: likes + 1,
    })
  }

  const handleRemove = async (blog) => {
    const result = window.confirm(`Remove ${blog.title} by ${blog.author}`)

    if (result) {
      await blogService.remove({
        id: blog.id,
      })
      setMessage({
        text: 'blog removed',
        type: 'success',
      })
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        handleSubmit={handleLogin}
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
      />
    </Togglable>
  )

  const userInfo = () => (
    <div>
      {user.name} logged in <button onClick={logout}>Logout</button>
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel="Add Blog" ref={blogFromRef}>
      <BlogForm addBlog={addBlog}></BlogForm>
    </Togglable>
  )

  return (
    <div>
      <Notification message={message} />
      {user === null ? (
        <div>
          <h2>Log in to application</h2>
          {loginForm()}
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          {userInfo()}
          {blogForm()}
          {blogs.sort((a, b) => (a.likes > b.likes ? -1 : 1)) &&
            blogs.map((blog) => (
              // eslint-disable-next-line react/jsx-key
              <Blog
                blog={blog}
                handleLikes={handleLikes}
                handleRemove={handleRemove}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
