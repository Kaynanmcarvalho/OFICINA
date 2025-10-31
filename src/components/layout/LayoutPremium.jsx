import { Outlet } from 'react-router-dom';

const LayoutPremium = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FF0000 0%, #00FF00 50%, #0000FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      padding: '20px'
    }}>
      <div style={{
        background: 'yellow',
        color: 'black',
        padding: '40px',
        borderRadius: '20px',
        fontSize: '32px',
        fontWeight: 'bold',
        textAlign: 'center',
        boxShadow: '0 10px 50px rgba(0,0,0,0.5)',
        marginBottom: '20px'
      }}>
        🎨 LAYOUT PREMIUM ESTÁ ATIVO!!!
        <br />
        <span style={{ fontSize: '20px' }}>Se você vê isso, o LayoutPremium funciona!</span>
      </div>
      
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '100%'
      }}>
        <Outlet />
      </div>
    </div>
  );
};

export { LayoutPremium };
