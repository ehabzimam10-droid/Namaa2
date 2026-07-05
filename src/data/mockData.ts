export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: string;
}

export interface Kid {
  id: string;
  name: string;
  age: number;
  allowance: number;
  saved: number;
  donationPoints: number;
  transactions: Transaction[];
}

export interface Father {
  name: string;
}

export interface FamilyData {
  father: Father;
  kids: Kid[];
}

export const mockFamilyData: FamilyData = {
  father: {
    name: "أبو خالد",
  },
  kids: [
    {
      id: "kid_khalid",
      name: "خالد",
      age: 15,
      allowance: 500,
      saved: 100,
      donationPoints: 0,
      transactions: [
        {
          id: "tx_k_1",
          title: "مصروف الجيب الأسبوعي",
          amount: 500,
          type: "deposit",
          date: "2026-06-25",
        },
        {
          id: "tx_k_2",
          title: "شراء كتاب للبرمجة",
          amount: 150,
          type: "withdrawal",
          date: "2026-06-26",
        },
        {
          id: "tx_k_3",
          title: "مكافأة إتمام التحدي الرياضي",
          amount: 50,
          type: "deposit",
          date: "2026-06-28",
        },
        {
          id: "tx_k_4",
          title: "اشتراك إنترنت شهري",
          amount: 300,
          type: "withdrawal",
          date: "2026-06-29",
        },
      ],
    },
    {
      id: "kid_salem",
      name: "سالم",
      age: 10,
      allowance: 100,
      saved: 60,
      donationPoints: 0,
      transactions: [
        {
          id: "tx_s_1",
          title: "مصروف الجيب الأسبوعي",
          amount: 100,
          type: "deposit",
          date: "2026-06-25",
        },
        {
          id: "tx_s_2",
          title: "شراء علبة ألوان رسم",
          amount: 30,
          type: "withdrawal",
          date: "2026-06-26",
        },
        {
          id: "tx_s_3",
          title: "مكافأة مساعدة في ترتيب المنزل",
          amount: 10,
          type: "deposit",
          date: "2026-06-27",
        },
        {
          id: "tx_s_4",
          title: "شراء حلوى وصودا",
          amount: 20,
          type: "withdrawal",
          date: "2026-06-28",
        },
      ],
    },
  ],
};
