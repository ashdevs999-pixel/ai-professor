export default function TestPage() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>✅ Server is Working!</h1>
      <p>If you can see this, the server is running correctly.</p>
      <p>Time: {new Date().toLocaleString()}</p>
    </div>
  )
}
