import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ComplementaryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // Optional Tailwind classes for the drawer container
  overlayClassName?: string; // Optional Tailwind classes for the overlay
}

const ComplementaryDrawer: React.FC<ComplementaryDrawerProps> = ({
  isOpen,
  onClose,
  children,
  className = 'bg-white border-t border-gray-200 shadow-md',
  overlayClassName = 'fixed inset-0 bg-black/50 z-40',
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.body.classList.add('overflow-hidden'); // Prevent scrolling on the main body
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Optional: Add a slight delay for the transition to be visible
      setTimeout(() => {
        if (drawerRef.current) {
          drawerRef.current.classList.remove('translate-y-full');
        }
      }, 0);
    } else {
      if (drawerRef.current) {
        drawerRef.current.classList.add('translate-y-full');
      }
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="relative z-50">
      {/* Overlay */}
      <div className={overlayClassName} onClick={onClose} />

      {/* Drawer Panel */}
      <div
        ref={drawerRef}
        className={`fixed bottom-0 left-0 right-0 z-50 overflow-y-auto transition-transform duration-300 ease-in-out transform translate-y-full ${className}`}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-end justify-between">
            {/* Optional Header - You can pass a title prop if needed */}
            {/* <h2 className="text-lg font-semibold">{title}</h2> */}
            <button
              type="button"
              className="p-1 hover:bg-red-100 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
              onClick={onClose}
            >
              <span className="sr-only">Close panel</span>
              <X className=" font-bold h-8 w-8" />
            </button>
          </div>
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ComplementaryDrawer;