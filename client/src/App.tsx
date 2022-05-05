import { useState, useEffect } from 'react';
import AddExpenseModal from './components/AddExpenseModal';
import TotalBudgetCard from './components/TotalBudgetCard';
import { ViewExpensesModal } from './components/ViewExpensesModal';
import { BudgetCard } from './components/BudgetCard';
import { AddBudgetModal } from './components/AddBudgetModal';
import { Button, Stack, Container } from "react-bootstrap"
import { UncategorizedBudgetCard } from './components/UncategorizedBudgetCard';

interface budgetDetails {
  id: number;
  name: string;
  totalExpense: number;
  maxSpending: number;
}

function App(): JSX.Element {
  // const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(true);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState<boolean>(false);
  const [showAddExpenseModal, setshowAddExpenseModal] = useState<boolean>(false);
  const [viewExpensesModalBudgetId, setViewExpensesModalBudgetId] = useState<number | null>(null);
  const [budgets, setBudgets] = useState<[any]>();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await fetch('http://localhost:5000/show_budgets');
        const data = await response.json();
        setBudgets(data.data);
        return Promise.resolve();
      } catch (err: any) {
        console.log(err);
        return Promise.resolve();
      }
    }
    fetchData();
  }, []);
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
              return <UncategorizedBudgetCard key={budget.id} amount={budget.totalExpense} onViewExpensesClick={() => setViewExpensesModalBudgetId(budget.id)} />
            } else {
              return (
                <BudgetCard key={budget.id} name={budget.name} amount={budget.totalExpense} hideButton={false} max={budget.maxSpending} onViewExpensesClick={() => setViewExpensesModalBudgetId(budget.id)} />
              )
            }
          })}
          <BudgetCard key={100} name={"Name 1"} amount={100} max={200} gray={true} hideButton={false} onAddExpenseClick={() => setShowAddBudgetModal(true)} onViewExpensesClick={() => setViewExpensesModalBudgetId(1)} />
          <UncategorizedBudgetCard onViewExpensesClick={() => setViewExpensesModalBudgetId(1)} amount={100} />
          <TotalBudgetCard />
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
