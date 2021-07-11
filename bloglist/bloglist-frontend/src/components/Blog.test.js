import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
//import { prettyDOM } from '@testing-library/dom'

const testBlog = {
  title: 'Otsikko',
  author: 'Mikko',
  url: 'www.testi.com',
  likes: 3,
  user: '60c878f70f648b4760c2163e',
}

test('renders blog with title & author', () => {
  const component = render(<Blog blog={testBlog} />)

  expect(component.container).toHaveTextContent(testBlog.title),
  expect(component.container).toHaveTextContent(testBlog.author)
})

test('clicking the button shows likes & url', async () => {
  const mockHandler = jest.fn()

  const component = render(<Blog blog={testBlog} handleLikes={mockHandler} />)

  const button = component.getByText('view')
  fireEvent.click(button)

  expect(component.container).toHaveTextContent(testBlog.likes)
  expect(component.container).toHaveTextContent(testBlog.url)
})

test('like button clicked twice, the event handler should be called twice', () => {
  const mockHandler = jest.fn()

  const component = render(<Blog blog={testBlog} handleLikes={mockHandler} />)

  const viewButton = component.getByText('view')
  fireEvent.click(viewButton)

  const likeButton = component.getByText('like')

  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
