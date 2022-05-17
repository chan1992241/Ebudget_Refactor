import { useState, useEffect } from 'react';
import AddExpenseModal from './components/AddExpenseModal';
import TotalBudgetCard from './components/TotalBudgetCard';
import { ViewExpensesModal } from './components/ViewExpensesModal';
import { BudgetCard } from './components/BudgetCard';
import { AddBudgetModal } from './components/AddBudgetModal';
import { Button, Stack, Container } from "react-bootstrap"
import { UncategorizedBudgetCard } from './components/UncategorizedBudgetCard';
import { useBudgets } from './contexts/BudgetsContext';
interface budgetDetails {
  budget_id: number;
  name: string;
  total_expense?: number;
  max_spending: number;
}

function App(): JSX.Element {
  // const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(true);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(false);
  const [showAddExpenseModal, setshowAddExpenseModal] = useState<boolean>(false);
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<[any]>();
  const [totalBudgets, setTotalBudgets] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const { isBudgetExpensesChanged, setIsBudgetExpensesChanged } = useBudgets();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch('http://localhost:5000/show_budgets');
        const data = await response.json();
        setBudgets(data.data);
        return Promise.resolve();
      } catch (err: any) {
        console.error(err);
        return Promise.resolve();
      }
    }
    fetchData();
    setIsBudgetExpensesChanged(false);
  }, [isBudgetExpensesChanged]);
  useEffect(() => {
    setTotalBudgets(0);
    setTotalExpenses(0);
    let totalBudgetsTemp = 0, totalExpensesTemp = 0;
    budgets && budgets.forEach(budget => {
      totalBudgetsTemp += budget.max_spending;
      totalExpensesTemp += budget.total_expense;
    });
    setTotalBudgets(totalBudgetsTemp);
    setTotalExpenses(totalExpensesTemp);
  }, [budgets]);
  return (
    <>
      <Container className="my-4">
        <Stack direction='horizontal' gap={"2" as any} className='mb-4'>
          <h1 className='me-auto'>Budgets</h1>
          <Button variant="primary" onClick={() => setShowAddBudgetModal(true)}>Add Budget</Button>
          <Button variant='outline-primary' onClick={() => setshowAddExpenseModal(true)}>Add Expense</Button>
        </Stack>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem", alignItems: "flex-start" }}>
          {budgets && budgets.map((budget: budgetDetails) => {
            if (budget.name === "Uncategorized") {
              return <UncategorizedBudgetCard key={budget.budget_id} amount={budget.total_expense || 0} onViewExpensesClick={() => setViewExpensesModalBudgetId(budget.budget_id)} />
            } else {
              return (
                <BudgetCard key={budget.budget_id} name={budget.name} amount={budget.total_expense || 0} hideButton={false} max={budget.max_spending} onViewExpensesClick={() => setViewExpensesModalBudgetId(budget.budget_id)} />
              )
            }
          })}
          <TotalBudgetCard amount={totalExpenses} max={totalBudgets} />
        </div>
      </Container>
      <AddBudgetModal show={showAddBudgetModal}
        handleClose={() => setShowAddBudgetModal(false)} />
      <AddExpenseModal show={showAddExpenseModal} handleClose={() => setshowAddExpenseModal(false)} defaulBudgetId={"1"} />
      <ViewExpensesModal budgetId={viewExpensesModalBudgetId} handleClose={() => setViewExpensesModalBudgetId(null)} />
    </>
  );
}

export default App;
