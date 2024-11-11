import { useContext } from "react";
import { TransactionContext } from "../contexts/TransactionContext";

const useTransaction = () => useContext(TransactionContext);

export default useTransaction;
