import React from 'react';

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-black-light p-6 rounded-xl shadow-xl max-w-sm w-full text-white">
        <h2 className="text-lg font-semibold mb-3">Are you sure?</h2>
        <p className="text-sm text-secondary-text mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="text-white hover:underline">Cancel</button>
          <button onClick={onConfirm} className="text-error font-semibold hover:underline">Continue</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
