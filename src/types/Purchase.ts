export interface PurchaseHistory {
    id_HistoryBuy: string;
    purchaseDate: string;
    totalPrice: number;
    id_User: string;
    id_tripQuest: string;
    quantity: number;
    id_Payment?: string;
    idTransaction?: string;
    activationCode?: string;
    paymentMethod?: string;
    userName?: string;
    tripQuestName?: string;
  }
  