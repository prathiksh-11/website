import { Navigate } from 'react-router-dom';

/** Legacy per-type report routes now use the unified analytics page. */
export const BookingReport = () => <Navigate to="/reports" replace />;
