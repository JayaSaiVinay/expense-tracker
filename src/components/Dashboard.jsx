import React, { useEffect, useState } from "react";
import { Card, Row, Popconfirm, Table, Button, Input, Space } from "antd";
import { Line, Pie } from "@ant-design/charts";
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { unparse } from "papaparse";
import { onAuthStateChanged } from "firebase/auth";
import {
  getDocs,
  query,
  writeBatch,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  collection,
} from "firebase/firestore";

// Importing from your existing files
import { auth, db } from "../firebase";
import Header from "./Header";
import AddIncomeModal from "./Modals/AddIncome";
import AddExpenseModal from "./Modals/AddExpense";
import Cards from "./Cards";
import NoTransactions from "./NoTransactions";
import Loader from "./Loader";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTransactions(currentUser.uid);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const showExpenseModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = (transaction = null) => {
    setEditingTransaction(transaction);
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
    setEditingTransaction(null);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
    setEditingTransaction(null);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    if (editingTransaction) {
      updateTransaction(newTransaction);
    } else {
      addTransaction(newTransaction);
    }
  };

  async function addTransaction(transaction) {
    if (!user) return;
    try {
      await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      toast.success("Transaction Added!");
      fetchTransactions(user.uid);
      handleExpenseCancel();
      handleIncomeCancel();
    } catch (e) {
      toast.error("Couldn't add transaction");
    }
  }

  async function updateTransaction(transaction) {
    if (!user) return;
    try {
      const transactionRef = doc(
        db,
        `users/${user.uid}/transactions`,
        editingTransaction.id
      );
      await updateDoc(transactionRef, transaction);
      toast.success("Transaction Updated!");
      fetchTransactions(user.uid);
      handleExpenseCancel();
      handleIncomeCancel();
    } catch (e) {
      toast.error("Couldn't update transaction");
    }
  }

  async function deleteTransaction(id) {
    if (!user) return;
    try {
      const transactionRef = doc(db, `users/${user.uid}/transactions`, id);
      await deleteDoc(transactionRef);
      toast.success("Transaction Deleted!");
      fetchTransactions(user.uid);
    } catch (e) {
      toast.error("Couldn't delete transaction");
    }
  }

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
  };

  async function fetchTransactions(uid) {
    setLoading(true);
    try {
      const q = query(collection(db, `users/${uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        transactionsArray.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transactionsArray);
    } catch (error) {
      toast.error("Failed to fetch transactions.");
    }
    setLoading(false);
  }

  const processChartData = () => {
    const spendingData = {};
    const monthlyMap = {};
    transactions.forEach((transaction) => {
      const monthYear = dayjs(transaction.date).format("YYYY-MM");
      const tag = transaction.tag;
      if (transaction.type === "expense") {
        spendingData[tag] = (spendingData[tag] || 0) + transaction.amount;
      }
      if (monthlyMap[monthYear]) {
        monthlyMap[monthYear] +=
          transaction.type === "income" ? transaction.amount : -transaction.amount;
      } else {
        monthlyMap[monthYear] =
          transaction.type === "income" ? transaction.amount : -transaction.amount;
      }
    });
    const sortedMonths = Object.keys(monthlyMap).sort();
    let runningBalance = 0;
    const balanceData = sortedMonths.map((month) => {
      runningBalance += monthlyMap[month];
      return {
        month: dayjs(month).format("MMM YYYY"),
        balance: runningBalance,
      };
    });
    const spendingDataArray = Object.keys(spendingData).map((key) => ({
      category: key,
      value: spendingData[key],
    }));
    return { balanceData, spendingDataArray };
  };

  const { balanceData, spendingDataArray } = processChartData();

  async function reset() {
    if (!user) return;
    setLoading(true);
    try {
      const transactionsQuery = query(
        collection(db, `users/${user.uid}/transactions`)
      );
      const querySnapshot = await getDocs(transactionsQuery);
      const batch = writeBatch(db);
      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      setTransactions([]);
      toast.success("All transactions have been reset!");
    } catch (error) {
      toast.error("Failed to reset transactions.");
    }
    setLoading(false);
  }

  function exportToCsv() {
    const csv = unparse(transactions, {
      fields: ["name", "type", "date", "amount", "tag"],
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "400px",
    flex: 1,
  };

  // ✅ Filter transactions based on search
  const filteredTransactions = transactions.filter(
    (t) =>
      t.name.toLowerCase().includes(searchText.toLowerCase()) ||
      t.tag.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `Rs. ${text}`,
      sorter: (a, b) => a.amount - b.amount,  
    },
    { title: "Tag", dataIndex: "tag", key: "tag" },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date), 
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() =>
              record.type === "income"
                ? showIncomeModal(record)
                : showExpenseModal(record)
            }
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete the transaction"
            description="Are you sure to delete this transaction?"
            onConfirm={() => deleteTransaction(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="dashboard-container p-4">
      <Header />
      {loading ? (
        <Loader />
      ) : (
        <>
          <Cards
            currentBalance={currentBalance}
            income={income}
            expenses={expenses}
            showExpenseModal={() => showExpenseModal()}
            showIncomeModal={() => showIncomeModal()}
            cardStyle={cardStyle}
            reset={reset}
          />
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
            initialValues={editingTransaction}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
            initialValues={editingTransaction}
          />
          {transactions.length === 0 ? (
            <NoTransactions />
          ) : (
            <>
              <Row gutter={16}>
                <Card bordered={true} style={cardStyle}>
                  <h2>Financial Statistics</h2>
                  <Line data={balanceData} xField="month" yField="balance" autoFit />
                </Card>
                <Card bordered={true} style={{ ...cardStyle, flex: 0.45 }}>
                  <h2>Total Spending</h2>
                  {spendingDataArray.length === 0 ? (
                    <p>No expenses recorded yet.</p>
                  ) : (
                    <Pie
                      data={spendingDataArray}
                      angleField="value"
                      colorField="category"
                      autoFit
                    />
                  )}
                </Card>
              </Row>
              <div className="my-8">
                <h2 className="text-2xl font-semibold mb-4">My Transactions</h2>

                {/* ✅ Search Input */}
                <Input
                  prefix={<SearchOutlined />}
                  placeholder="Search by name or tag"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ maxWidth: 300, marginBottom: "1rem" }}
                />

                <Table
                  dataSource={filteredTransactions}
                  columns={columns}
                  rowKey="id"
                />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
