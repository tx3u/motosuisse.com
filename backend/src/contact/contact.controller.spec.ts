import { ContactController } from './contact.controller';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockService = {
  send: jest.fn(),
  findAll: jest.fn(),
  markAsRead: jest.fn(),
  remove: jest.fn(),
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ContactController', () => {
  let controller: ContactController;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ContactController(mockService as never);
  });

  it('send delegates dto to service', async () => {
    const dto = { nom: 'Jean', email: 'jean@test.com', message: 'Bonjour' };
    const result = { message: 'Message envoyé avec succès.' };
    mockService.send.mockResolvedValue(result);

    expect(await controller.send(dto as never)).toBe(result);
    expect(mockService.send).toHaveBeenCalledWith(dto);
  });

  it('findAll delegates to service', async () => {
    const messages = [{ id: 1 }, { id: 2 }];
    mockService.findAll.mockResolvedValue(messages);

    expect(await controller.findAll()).toBe(messages);
    expect(mockService.findAll).toHaveBeenCalledTimes(1);
  });

  it('markAsRead delegates id to service', async () => {
    const updated = { id: 1, lu: true };
    mockService.markAsRead.mockResolvedValue(updated);

    expect(await controller.markAsRead(1)).toBe(updated);
    expect(mockService.markAsRead).toHaveBeenCalledWith(1);
  });

  it('remove delegates id to service', async () => {
    const result = { message: 'Message supprimé.' };
    mockService.remove.mockResolvedValue(result);

    expect(await controller.remove(1)).toBe(result);
    expect(mockService.remove).toHaveBeenCalledWith(1);
  });
});
