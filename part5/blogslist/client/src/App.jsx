import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogService'
import Login from './components/Login'
import AddBlogForm from './components/AddBlogForm'
import Notification from './components/Notification'
import BlogList from './components/BlogList'
import Togglable from './components/Togglable'


function App() {
  const [blogList, setBlogList] = useState([])
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await blogService.getData()
        setBlogList(data)
      } catch (err) {
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsListUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      if (!username?.trim() || !password?.trim()) {
        handleNotification('error-message', 'Both username and password are required')
        return
      }

      const user = await blogService.userLogin({ username, password })

      window.localStorage.setItem(
        'loggedBlogsListUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification('')  // Removes any previous log error notification message after logging in
    } catch (err) {
      console.error(err)
      handleNotification('error-message', 'Incorrect credentials')
    }
  }

  const handleLogout = async () => {
    try {
      const isLogged = window.localStorage.getItem('loggedBlogsListUser')
      if (!isLogged) {
        handleNotification('error-message', 'User has already been logged out')
        setUser(null)
      } else {
        window.localStorage.removeItem('loggedBlogsListUser')
        handleNotification('success-message', `${user.name} has logged out`)
        setUser(null)
      }
    } catch (err) {
      console.error(err)
      handleNotification('error-message', 'Failed to logout the current user')
    }
  }

  const handleNotification = (type, message) => {
    setNotificationType(type)
    setNotification(message)
    setTimeout(() => {
      setNotificationType('')
      setNotification('')
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.storeData(blogObject)
      setBlogList(blogList.concat(savedBlog))
      blogFormRef.current.toggleVisibility()
      handleNotification('success-message', `The blog "${savedBlog.title}" by ${savedBlog.author} was added to the list!`)
    } catch (err) {
      console.error(err)
      handleNotification('error-message', 'Failed to add a new blog')
    }
  }

  const handleLikes = async (blogToUpdate) => {
    // Store original state for potential rollback
    const previousLikes = blogToUpdate.likes

    try {
      // Update the UI immediately, local only
      const localUpdateBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
      setBlogList(blogList.map(blog =>
        blog.id === blogToUpdate.id ? localUpdateBlog : blog
      ))

      // Update on the remote server
      await blogService.updateData(blogToUpdate.id, {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
      })
    } catch (err) {
      console.error(err)
      handleNotification('error-message', 'Failed to update the blog\'s like counter')

      // If the remote database update fails, rollback to the previous like counter
      setBlogList(blogList.map(blog =>
        blog.id === blogToUpdate.id
          ? { ...blog, likes: previousLikes }
          : blog
      ))
    }
  }

  const handleDelete = async (blogToRemove) => {
    try {
      const isInDatabase = await blogService.getDataById(blogToRemove.id)

      if (isInDatabase) {
        await blogService.removeData(blogToRemove.id)
        setBlogList(blogList.filter(blog => blog.id !== blogToRemove.id))
        handleNotification('success-message', `The blog "${blogToRemove.title}" by ${blogToRemove.author} was removed from the list"`)
      } else {
        setBlogList(blogList.filter(blog => blog.id !== blogToRemove.id))
        handleNotification('error-message', 'The blog was already removed from the database')
      }
    } catch (err) {
      console.error(err)
      handleNotification('error-message', 'Failed to remove blog from the list')
    }
  }

  if (!blogList) {
    return <h2>Failed to get data from the server</h2>
  }

  if (isLoading) {
    return <h2>Loading data, please wait...</h2>
  }

  return (
    <>
      <h1 className='main-title'>Blogs List</h1>
      {!user && (
        <Login
          handleLogin={handleLogin}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
        />
      )}
      {user && (
        <div>
          <p>
            <strong>{user.name}</strong> logged in
            <button onClick={handleLogout}>logout</button>
          </p>
          <Togglable buttonLabel="Add blog" ref={blogFormRef}>
            <AddBlogForm
              addBlog={addBlog}
            />
          </Togglable>
        </div>
      )}
      {notification && <Notification
        messageType={notificationType}
        message={notification}
      />}
      <BlogList
        blogList={blogList}
        handleLikes={handleLikes}
        handleDelete={handleDelete}
        user={user}
      />
      <footer>Blogs List app, from the FullStackOpen course by MOOC Finland 2025.</footer>
    </>
  )
}

export default App
