import React, { useState } from 'react';
import { AppDispatch } from '../redux/store';
import { createTripType } from '../redux/tripTypesSlice';
import { useDispatch } from 'react-redux';
interface CreateTripTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    creating: boolean;
    onCreateSuccess: (newTripTypeId: string) => void;
  }
const CreateTripTypeModal: React.FC<CreateTripTypeModalProps> = ({
  isOpen,
  onClose,
  creating,
  onCreateSuccess,
}) => {
    const [newTripType, setNewTripType] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const handleCreate = (): void => {
        if (newTripType.trim()) {
          dispatch(createTripType(newTripType))
          .then((action) => {
            const newType = action.payload; // Lấy dữ liệu từ payload
            setNewTripType('');
            onCreateSuccess(newType.id);  // Truyền id
            onClose();
          })
          
            .catch((error) => {
              console.error("Error creating trip type", error);
            });
        }
      };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Nhập tên thể loại mới</h2>
        <div className="flex flex-col">
          <input
            type="text"
            value={newTripType}
            onChange={(e) => setNewTripType(e.target.value)}
            placeholder="Nhập tên thể loại"
            className="p-2 border border-gray-300 rounded mb-4"
          />
          <button
            type="button"
            onClick={handleCreate}
            className="p-2 bg-green-500 text-white rounded"
            disabled={creating || !newTripType.trim()}
          >
            {creating ? 'Đang tạo...' : 'Tạo'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-2 p-2 bg-gray-500 text-white rounded"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTripTypeModal;
