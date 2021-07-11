import React, { useState } from 'react'


const Blog = ({ blog, handleLikes, handleRemove }) => {
  const [showDetails, setShowDetails] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const showBlogDetails = () => {
    return (
      <div>
        <p>{blog.url}</p>
        <p>
          {blog.likes}{' '}
          <button className='like' onClick={() => handleLikes(blog.id, blog.likes)}>like</button>
        </p>
        <p>{blog.user.name}</p>
        <button className='remove' onClick={() => handleRemove(blog)}>Remove</button>
      </div>
    )
  }

  return (
    <div style={blogStyle}>
      <p>{blog.title}</p>
      <i>{blog.author}</i>
      <button onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? 'hide' : 'view'}
      </button>
      {showDetails && showBlogDetails()}
    </div>
  )
}

export default Blog