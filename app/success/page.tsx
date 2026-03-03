export default function SuccessPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'sans-serif',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        border: '1px solid #333',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', letterSpacing: '2px', marginBottom: '20px' }}>TRANSACTION VERIFIED</h1>
        <div style={{ height: '2px', backgroundColor: '#fff', margin: '20px 0' }}></div>
        <p style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
          Thank you for your investment in <strong>Future Audit Intelligence</strong>.
        </p>
        <div style={{ backgroundColor: '#111', padding: '20px', marginBottom: '30px', border: '1px dashed #444' }}>
          <p style={{ margin: 0, fontSize: '14px' }}>
            A secure download link has been dispatched to your registered email address.
            Please check your inbox (including <strong>spam/junk</strong> folders) immediately.
          </p>
        </div>
        <p style={{ fontSize: '12px', color: '#888' }}>
          Assets are encrypted and tracked for security purposes. Access will expire in 48 hours.
        </p>
        <a href="/" style={{
          display: 'inline-block',
          marginTop: '30px',
          color: '#fff',
          textDecoration: 'underline',
          fontSize: '14px'
        }}>
          Return to Intelligence Lab
        </a>
      </div>
    </div>
  );
}
