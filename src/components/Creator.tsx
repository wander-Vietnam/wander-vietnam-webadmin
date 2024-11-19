import React, { useState } from "react";
import Create from "./Create";

const Creator: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Tạo
        </button>
      </div>

      {/* Conditionally render Create modal */}
      {isModalOpen && <Create closeModal={closeModal} />}
    </div>
  );
};

export default Creator;
