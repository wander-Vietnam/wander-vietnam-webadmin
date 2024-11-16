import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "../redux/imageSlice";
import { RootState } from "../redux/store";
import { AppDispatch } from "../redux/store";

const Creator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { imageLinks, loading, error } = useSelector(
    (state: RootState) => state.images
  );
  const [tripQuestData, setTripQuestData] = useState<{
    tripQuestName: string;
    description: string;
    imageUrl: string[]; // Đảm bảo là mảng
    highlights: string[];
    importantDetails: string[];
    price: number;
    isForTeamBuilding: boolean;
    id_TripType: string;
    expectedDuration: string;
    startTime: string;
    endTime: string;
  }>({
    tripQuestName: "",
    description: "",
    imageUrl: [], // Khởi tạo là mảng rỗng
    highlights: [],
    importantDetails: [],
    price: 0,
    isForTeamBuilding: false,
    id_TripType: "",
    expectedDuration: "",
    startTime: "",
    endTime: "",
  });

  useEffect(() => {
    if (Array.isArray(imageLinks)) {
      setTripQuestData((prev) => ({
        ...prev,
        imageUrl: imageLinks,
      }));
    }
  }, [imageLinks]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTripQuestData((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      dispatch(uploadImage(formData)).then((response) => {
        const uploadedUrl = response.payload;

        // Thêm URL vào mảng imageUrl nếu nó là mảng, nếu không thì tạo mảng mới
        setTripQuestData((prev: any) => ({
          ...prev,
          imageUrl: Array.isArray(prev.imageUrl)
            ? [...prev.imageUrl, uploadedUrl]
            : [uploadedUrl], // Kiểm tra nếu imageUrl là mảng, nếu không tạo một mảng mới
        }));
      });
    }
  };

  console.log(tripQuestData.imageUrl);

  const handleImageDelete = (index: number) => {
    // Đảm bảo imageLinks là mảng trước khi sử dụng
    const currentImageLinks = Array.isArray(tripQuestData.imageUrl) ? tripQuestData.imageUrl : [];
    
    const updatedLinks = currentImageLinks.filter((_, i) => i !== index);
    
    setTripQuestData((prev: any) => ({
      ...prev,
      imageUrl: updatedLinks,
    }));
  };
  

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(tripQuestData);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Tạo Trip Quest</h1>
      <form onSubmit={handleSubmit}>
        {/* Trip Quest Name */}
        <div className="mb-4">
          <label htmlFor="tripQuestName" className="block text-gray-700 mb-2">
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
                      src={image.url} // Sử dụng image.url thay vì link
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

        {/* Is For Team Building */}
        <div className="mb-4">
          <label
            htmlFor="isForTeamBuilding"
            className="block text-gray-700 mb-2"
          >
            Dành Cho Team Building
          </label>
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
            className="mr-2"
          />
          Có
        </div>

        {/* ID Trip Type */}
        <div className="mb-4">
          <label htmlFor="id_TripType" className="block text-gray-700 mb-2">
            Thể loại
          </label>
          <input
            type="text"
            id="id_TripType"
            name="id_TripType"
            value={tripQuestData.id_TripType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
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
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Tạo Trip Quest
          </button>
        </div>
      </form>
    </div>
  );
};

export default Creator;
