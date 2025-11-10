import { useState, useEffect } from 'react'
import blogService from './services/blogService'
import Notification from './components/Notification'
import BlogList from './components/BlogList';
import AddBlogForm from './components/AddBlogForm';

function App() {
  const [blogList, setBlogList] = useState([]);
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '', likes: 0 })
  const [notification, setNotification] = useState('')
  const [notificationType, setNotificationType] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')

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

  const handleNotification = (type, message) => {
    setNotification(type);
    setNotification(message);
    setTimeout(() => {
      setNotificationType('');
      setNotification('');
    }, 5000);
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      ...newBlog
    }

    const savedBlog = await blogService.storeData(blogObject)
    setBlogList(blogList.concat(savedBlog))
    setNewBlog({ title: '', author: '', url: '', likes: 0 })
  }

  if (!blogList) {
    return <h2>Failed to get data from the server</h2>
  }

  if (isLoading) {
    return <h2>Loading data, please wait...</h2>
  }

  return (
    <>
      <h1>Blogs List</h1>
      <Notification
        message={notification}
        messageType={notificationType}
      />
      <AddBlogForm
        newBlog={newBlog}
        setNewBlog={setNewBlog}
        addBlog={addBlog}
      />
      <BlogList
        blogList={blogList}
      />
    </>
  )
}

export default App
