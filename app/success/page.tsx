export default function SuccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'Courier New, Courier, monospace',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '600px',
        width: '100%',
        border: '1px solid #333',
        padding: '50px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '28px', letterSpacing: '4px', marginBottom: '20px', fontWeight: 'bold' }}>ACCESS GRANTED</h1>
        <div style={{ height: '4px', backgroundColor: '#fff', margin: '30px 0' }}></div>
        
        <p style={{ fontSize: '18px', color: '#ccc', marginBottom: '40px' }}>
          Your acquisition of <strong>Future Audit Strategic Assets</strong> has been verified.
        </p>

        <div style={{ backgroundColor: '#111', padding: '25px', marginBottom: '30px', border: '1px dashed #555' }}>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.8' }}>
            A secure link to your intelligence report (PDF) has been sent to your email.<br/>
            <strong>Check your inbox & spam folder immediately.</strong>
          </p>
        </div>

        <p style={{ fontSize: '12px', color: '#666', marginBottom: '40px' }}>
          If you do not receive the email within 10 minutes, please contact:<br/>
          <span style={{ color: '#aaa' }}>info@future-audit.org</span>
        </p>

        <div style={{ borderTop: '1px solid #222', paddingTop: '30px' }}>
          <a href="/" style={{
            color: '#fff',
            textDecoration: 'none',
            fontSize: '12px',
            border: '1px solid #fff',
            padding: '10px 20px',
            letterSpacing: '1px'
          }}>RETURN TO LAB</a>
        </div>
      </div>
    </div>
  );
}
