import { render, screen } from '@testing-library/react'
import AddBlogForm from './AddBlogForm'
import userEvent from '@testing-library/user-event'

test('<AddBlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<AddBlogForm addBlog={createBlog} />)

  const titleInput = screen.getByLabelText('Title')
  const authorInput = screen.getByLabelText('Author')
  const urlInput = screen.getByLabelText('URL')
  const sendButton = screen.getByText('Submit')

  await user.type(titleInput, 'Testing blog')
  await user.type(authorInput, 'The Developer')
  await user.type(urlInput, 'http://testing-blogs.com')
  await user.click(sendButton)

  const submittedBlog = createBlog.mock.calls[0][0]

  expect(submittedBlog.title).toBe('Testing blog')
  expect(submittedBlog.author).toBe('The Developer')
  expect(submittedBlog.url).toBe('http://testing-blogs.com')
})