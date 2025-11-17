export default function Login({
  handleLogin,
  username,
  setUsername,
  password,
  setPassword,
}) {
  return (
    <>
      <h2>Login</h2>
      <div className="container">
        <form onSubmit={handleLogin}>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit" id="login-button">login</button>
        </form>
      </div>
    </>
  )
}