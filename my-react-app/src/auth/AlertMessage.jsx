export default function AlertMessage({ alert }) {
  if (!alert) return null;

  return (
    <div className={`alert ${alert.type}`}>
      {alert.msg}
    </div>
  );
}