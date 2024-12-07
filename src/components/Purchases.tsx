import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPurchases } from "../redux/purchaseSlice"; // Assuming this file exists
import { RootState, AppDispatch } from "../redux/store";
import { PurchaseHistory } from "../types/Purchase"; // Adjust the import path as needed

const Purchases: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { purchases, loading, error } = useSelector(
    (state: RootState) => state.purchase // Adjust this path to match your Redux slice state
  );

  useEffect(() => {
    dispatch(fetchAllPurchases());
  }, [dispatch]);

  const formatPrice = (price: any) => {
    const priceNumber = parseFloat(price);
    return !isNaN(priceNumber)
      ? priceNumber.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      : "N/A";
  };
  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN"); // Format to dd/mm/yyyy
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Purchase History</h2>
      {loading && <p className="text-gray-600 italic">Loading...</p>}
      {error && (
        <p className="text-red-600">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {purchases.length > 0 ? (
          purchases.map((purchase: PurchaseHistory) => (
            <div
              key={purchase.id_HistoryBuy}
              className="bg-white border border-gray-300 rounded shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-blue-600 mb-2">
                  {purchase.tripQuestName} {/* Displaying tripQuestName */}
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>User:</strong> {purchase.userName} {/* Displaying userName */}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Purchase Date:</strong> {formatDate(purchase.purchaseDate)} {/* Formatting Date */}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Total Price:</strong> {formatPrice(purchase.totalPrice)} {/* Formatting Price */}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Quantity:</strong> {purchase.quantity}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Payment Method:</strong> {purchase.paymentMethod || "N/A"}
                </p>
                {purchase.activationCode && (
                  <p className="text-sm text-gray-700">
                    <strong>Activation Code:</strong> {purchase.activationCode}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-600">
            No purchase histories found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Purchases;
