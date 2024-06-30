import { render, screen, fireEvent} from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "06/24/2024";
  // Add task for the first time
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  // Check if task was added
  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
  // Add task for the second time
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  // Check if task was added only once
  check = screen.getByText(/History Test/i);
  const tasks = screen.getAllByText(/History Test/i);
  expect(tasks.length).toBe(1);
});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "06/24/2024";
  // Attempt to add task
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  // Check that task was not added
  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp(dueDate, "i"));
  expect(check).not.toBeInTheDocument();
  expect(checkDate).not.toBeInTheDocument();
});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "06/24/2024";
  // Attempt to add task
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.click(element);
  // Check that task was not added
  const check = screen.queryByTestId("History Test");
  expect(check).not.toBeInTheDocument();
});



test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "06/24/2024";
  // Add task
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  // Find checkbox and click it to delete the task
  const checkbox = screen.getByRole('checkbox', { name: /History Test checkbox/i });
  fireEvent.click(checkbox);
  // Check that task was deleted
  const check = screen.getByTestId(/History Test/i)
  expect(check).not.toBeInTheDocument();
});


test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', {name: /Add New Item/i});
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', {name: /Add/i});
  const dueDate = "01/01/2020";
  // Add task
  fireEvent.change(inputTask, { target: { value: "History Test"}});
  fireEvent.change(inputDate, { target: { value: dueDate}});
  fireEvent.click(element);
  // Check if task was added with the correct color
  const check = screen.getByTestId(/History Test/i).style.background
  expect(check).toBe("pink");
});
