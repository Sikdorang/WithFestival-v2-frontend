import { QuantityController } from '@/shared/ui/quantity-controller';
import {
  renderWithProviders,
  screen,
  userEvent,
} from '@/shared/lib/testing/test-utils';

describe('shared/ui QuantityController (unit)', () => {
  it('renders quantity and fires increase/decrease', async () => {
    const user = userEvent.setup();
    const onIncrease = jest.fn();
    const onDecrease = jest.fn();

    renderWithProviders(
      <QuantityController
        quantity={2}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />,
    );

    expect(screen.getByText('2')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: '−' }));

    expect(onIncrease).toHaveBeenCalledTimes(1);
    expect(onDecrease).toHaveBeenCalledTimes(1);
  });

  it('disables decrease at minimum', () => {
    renderWithProviders(
      <QuantityController
        quantity={1}
        min={1}
        onIncrease={jest.fn()}
        onDecrease={jest.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: '−' })).toBeDisabled();
  });
});
