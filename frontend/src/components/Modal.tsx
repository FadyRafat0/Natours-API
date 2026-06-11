import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

const Modal = ({ isOpen, onClose, title, children, maxWidth = '500px' }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '1rem', width: '90%', maxWidth, boxShadow: '0 2rem 6rem rgba(0,0,0,0.3)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '2.5rem', cursor: 'pointer', color: '#777' }}>&times;</button>
        <h2 className="heading-secondary ma-bt-md" style={{ fontSize: '2rem' }}>{title}</h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
