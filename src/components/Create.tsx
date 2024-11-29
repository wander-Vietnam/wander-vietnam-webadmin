import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../redux/imageSlice";
import { RootState } from "../redux/store";
import { AppDispatch } from "../redux/store";
import { fetchAllTripTypes, createTripType } from "../redux/tripTypesSlice";
import CreateTripTypeModal from "./CreateTripTypeModal";
import { CreateProps } from "../types/Create";
import { createTripquest } from "../redux/tripquestSlice";
const Create: React.FC<CreateProps> = ({ closeModal }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { imageLinks, loading, error } = useSelector(
    (state: RootState) => state.images
  );
  const { tripTypes, loadingTriptype, errorTriptype, creating } = useSelector(
    (state: any) => state.tripTypes
  );
  const [selectedTripType, setSelectedTripType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tripQuestData, setTripQuestData] = useState<{
    tripQuestName: string;
    description: string;
    imageUrl: string[];
    price: number;
    isForTeamBuilding: boolean;
    id_TripType: string;
    expectedDuration: string;
    startTime: string;
    endTime: string;
    importantDetails: string[];
    highlights: string[];
  }>({
    tripQuestName: "",
    description: "",
    imageUrl: [],
    price: 0,
    isForTeamBuilding: false,
    id_TripType: "",
    expectedDuration: "",
    startTime: "",
    endTime: "",
    importantDetails: [],
    highlights: [],
  });
  const [inputValue, setInputValue] = useState("");

  const handleAddDetail = () => {
    if (inputValue.trim() === "") return; // Nếu input trống thì không thêm
    setTripQuestData((prevData) => ({
      ...prevData,
      importantDetails: [...prevData.importantDetails, inputValue.trim()],
    }));
    setInputValue(""); // Xóa ô input sau khi thêm
  };

  const handleDeleteDetail = (index: number) => {
    setTripQuestData((prevData) => ({
      ...prevData,
      importantDetails: prevData.importantDetails.filter((_, i) => i !== index),
    }));
  };

  const [highlightValue, setHighlightValue] = useState("");

  const handleAddHighlight = () => {
    if (highlightValue.trim() === "") return; // Nếu input trống thì không thêm
    setTripQuestData((prevData) => ({
      ...prevData,
      highlights: [...prevData.highlights, highlightValue.trim()],
    }));
    setHighlightValue(""); // Xóa ô input sau khi thêm
  };

  // Xóa điểm nổi bật
  const handleDeleteHighlight = (index: number) => {
    setTripQuestData((prevData) => ({
      ...prevData,
      highlights: prevData.highlights.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    dispatch(fetchAllTripTypes());
  }, [dispatch]);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTripQuestData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("file", file));

      dispatch(uploadImage(formData)).then((response) => {
        const uploadedUrls = response.payload as string[];
        setTripQuestData((prev) => {
          const newImageUrls = Array.isArray(prev.imageUrl)
            ? [...prev.imageUrl, ...uploadedUrls]
            : uploadedUrls;
          const uniqueImageUrls = Array.from(new Set(newImageUrls));
          return {
            ...prev,
            imageUrl: uniqueImageUrls,
          };
        });
      });
    }
  };

  const handleImageDelete = (index: number) => {
    const updatedLinks = tripQuestData.imageUrl.filter((_, i) => i !== index);
    setTripQuestData((prev) => ({
      ...prev,
      imageUrl: updatedLinks,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createTripquest(tripQuestData));
    closeModal();
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value; // Lấy id từ value
    setSelectedTripType(selectedId); // Cập nhật trạng thái selectedTripType
    setTripQuestData((prev) => ({ ...prev, id_TripType: selectedId })); // Cập nhật tripQuestData
  };

  const handleCreateSuccess = (newTripTypeId: string) => {
    setSelectedTripType(newTripTypeId);
    setTripQuestData((prev) => ({ ...prev, id_TripType: selectedTripType }));
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-gray-800 bg-opacity-50 z-40 mr-4"
        onClick={closeModal}
      ></div>

      {/* Modal Content */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-7">
        <div className="p-6 max-w-4xl w-full mx-auto bg-white shadow-md rounded-md relative overflow-y-auto max-h-[90vh]">
          {/* Close Button */}
          <button
            className="absolute top-2 right-2 text-gray-500"
            onClick={closeModal}
          >
            X
          </button>
          <h1 className="text-2xl font-bold mb-4">Tạo Trip Quest</h1>
          <form onSubmit={handleSubmit}>
            {/* Trip Quest Name */}
            <div className="mb-4">
              <label
                htmlFor="tripQuestName"
                className="block text-gray-700 mb-2"
              >
                Tên Trip Quest *
              </label>
              <input
                type="text"
                id="tripQuestName"
                name="tripQuestName"
                value={tripQuestData.tripQuestName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block text-gray-700 mb-2">
                Mô tả
              </label>
              <textarea
                id="description"
                name="description"
                value={tripQuestData.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              ></textarea>
            </div>

            {/* Image Upload */}
            <div className="mb-4">
              <label htmlFor="imageUrl" className="block text-gray-700 mb-2">
                Tải ảnh lên
              </label>
              <input
                type="file"
                id="imageUrl"
                name="imageUrl"
                multiple
                onChange={handleImageUpload}
                className="w-full p-2 border border-gray-300 rounded"
              />
              {loading && <p>Đang tải ảnh...</p>}
              {/* {error && <p className="text-red-500">{error || 'Có lỗi xảy ra'}</p>} */}

              <div className="mt-4">
                {Array.isArray(tripQuestData.imageUrl) &&
                tripQuestData.imageUrl.length > 0 ? (
                  <div className="flex flex-wrap">
                    {tripQuestData.imageUrl.map((image: any, index) => (
                      <div key={index} className="relative mr-4 mb-4">
                        <img
                          src={image} // Sử dụng image.url thay vì link
                          alt={`Uploaded image ${index}`}
                          className="w-48 h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageDelete(index)}
                          className="absolute top-0 right-0 w-8 h-8 flex items-center justify-center text-white bg-red-500 rounded-full p-1"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>Chưa có ảnh nào được tải lên.</p>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <label htmlFor="price" className="block text-gray-700 mb-2">
                Giá *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={tripQuestData.price}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4 flex items-center">
              <label
                htmlFor="isForTeamBuilding"
                className="block text-gray-700 mr-4"
              >
                Dành Cho Team Building
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="isForTeamBuilding"
                  name="isForTeamBuilding"
                  checked={tripQuestData.isForTeamBuilding}
                  onChange={() =>
                    setTripQuestData((prev) => ({
                      ...prev,
                      isForTeamBuilding: !prev.isForTeamBuilding,
                    }))
                  }
                  className="sr-only"
                />
                {/* Phần nền của toggle */}
                <span
                  className={`w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${
                    tripQuestData.isForTeamBuilding
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                ></span>
                {/* Phần tròn bên trong toggle */}
                <span
                  className={`w-5 h-5 bg-white rounded-full shadow-md absolute transition-transform duration-300 ease-in-out ${
                    tripQuestData.isForTeamBuilding
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                ></span>
              </label>
            </div>

            <div className="mb-4">
              <label htmlFor="id_TripType" className="block text-gray-700 mb-2">
                Thể loại
              </label>

              {/* Dropdown chọn thể loại */}
              <div className="flex items-center">
                <select
                  id="id_TripType"
                  name="id_TripType"
                  className="w-full p-2 border border-gray-300 rounded"
                  onChange={handleSelectChange}
                  value={selectedTripType}
                  disabled={loading}
                >
                  <option value="">Chọn thể loại...</option>
                  {tripTypes.map((type: any) => (
                    <option key={type.id} value={type.id_TripType}>
                      {type.tripTypeName}
                    </option>
                  ))}
                </select>

                {/* Nút "Tạo mới" */}
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)} // Mở modal khi bấm nút
                  className="ml-2 p-2 bg-blue-500 text-white rounded"
                >
                  Tạo mới
                </button>
              </div>

              {/* Modal để nhập tên thể loại mới */}
              <CreateTripTypeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)} // Đóng modal
                creating={creating} // Truyền trạng thái đang tạo để disable nút khi cần thiết
                onCreateSuccess={handleCreateSuccess}
              />

              {/* Thông báo lỗi nếu có */}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>
            {/* Expected Duration */}
            <div className="mb-4">
              <label
                htmlFor="expectedDuration"
                className="block text-gray-700 mb-2"
              >
                Thời Lượng Dự Kiến
              </label>
              <input
                type="text"
                id="expectedDuration"
                name="expectedDuration"
                value={tripQuestData.expectedDuration}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* Start Time */}
            <div className="mb-4">
              <label htmlFor="startTime" className="block text-gray-700 mb-2">
                Giờ Bắt Đầu
              </label>
              <input
                type="text"
                id="startTime"
                name="startTime"
                value={tripQuestData.startTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>

            {/* End Time */}
            <div className="mb-4">
              <label htmlFor="endTime" className="block text-gray-700 mb-2">
                Giờ Kết Thúc
              </label>
              <input
                type="text"
                id="endTime"
                name="endTime"
                value={tripQuestData.endTime}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="importantDetails"
                className="block text-gray-700 mb-2"
              >
                Chi tiết quan trọng
              </label>
              <div className="flex space-x-2">
                <input
                  id="importantDetails"
                  name="importantDetails"
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập chi tiết quan trọng"
                />
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Thêm
                </button>
              </div>
              <ul className="mt-2">
                {tripQuestData.importantDetails.map((detail, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{detail}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteDetail(index)}
                      className="text-red-500 ml-2"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
              <small className="text-gray-500">
                Nhập các chi tiết quan trọng, nhấn "Thêm" để lưu vào danh sách.
              </small>
            </div>
            {/* Highlights */}
            <div className="mb-4">
              <label htmlFor="highlights" className="block text-gray-700 mb-2">
                Điểm nổi bật
              </label>
              <div className="flex space-x-2">
                <input
                  id="highlights"
                  name="highlights"
                  type="text"
                  value={highlightValue}
                  onChange={(e) => setHighlightValue(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Nhập điểm nổi bật"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="p-2 bg-blue-500 text-white rounded"
                >
                  Thêm
                </button>
              </div>
              <ul className="mt-2">
                {tripQuestData.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span>{highlight}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteHighlight(index)}
                      className="text-red-500 ml-2"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
              <small className="text-gray-500">
                Nhập các điểm nổi bật, nhấn "Thêm" để lưu vào danh sách.
              </small>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Create;
