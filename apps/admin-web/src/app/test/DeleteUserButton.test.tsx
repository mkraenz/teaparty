import configureStore from 'redux-mock-store';
import { render, screen, userEvent } from '../__tests__/test-utils';
import DeleteUserButton from './DeleteUserButton';

it('has the correct label', () => {
  const mockStore = configureStore();
  const store = mockStore({});

  render(<DeleteUserButton user={{ id: 'uid-1', username: 'roflcopter' }} />, {
    store,
  });
  expect(screen.getByLabelText('deleteUser')).toBeInTheDocument();
});

it('deletes a user', async () => {
  const mockStore = configureStore();
  const store = mockStore({});
  (window as any).confirm = () => true;

  render(
    <DeleteUserButton
      user={{ id: '-NlgX60k4-lf4yg4e4rT', username: 'roflcopter' }}
    />,
    { store }
  );
  const button = screen.getByRole('button');
  screen.debug(button);

  userEvent.click(button);
  // const ele = await screen.findByLabelText('loading');
  // expect(ele).toBeInTheDocument();
});

// it('should increment count on click', async () => {
//   render(<App />);
//   userEvent.click(screen.getByRole('button'));
//   expect(await screen.findByText(/count is: 1/i)).toBeInTheDocument();
// });

// it('uses flexbox in app header', async () => {
//   render(<App />);
//   const element = screen.getByRole('banner');
//   expect(element.className).toEqual('App-header');
//   expect(getComputedStyle(element).display).toEqual('flex');
// });
