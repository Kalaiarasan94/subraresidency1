import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminPortal } from '../features/admin';
import { CustomerPortal } from '../features/customer';
import { ReceptionPortal } from '../features/reception';
import { resolvePortalFromHost } from './portalDomains';

function App() {
  const portal = resolvePortalFromHost();

  if (portal === 'admin') {
    return <AdminPortal />;
  }

  if (portal === 'reception') {
    return <ReceptionPortal />;
  }

  if (portal === 'customer') {
    return <CustomerPortal />;
  }

  return (
    <Routes>
      <Route path="/*" element={<CustomerPortal />} />
      <Route path="/reception/*" element={<ReceptionPortal />} />
      <Route path="/admin/*" element={<AdminPortal />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
