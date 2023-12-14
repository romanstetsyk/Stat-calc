import { ExternalStore } from '~/framework/external-store';
import type { TSession } from '~/types';

import type { SessionData } from './types';

class SessionStore extends ExternalStore<SessionData> {
  protected snapshot: SessionData;

  public constructor() {
    super();

    this.snapshot = {
      session: [],
      addSessionItem: this.addSessionItem.bind(this),
      updateSessionItem: this.updateSessionItem.bind(this),
      removeSessionItem: this.removeSessionItem.bind(this),
    };
  }

  private addSessionItem(item: TSession): void {
    this.snapshot.session = [...this.snapshot.session, item];
    this.emitChange();
  }

  private updateSessionItem(newItem: TSession): void {
    this.snapshot.session = this.snapshot.session.map((item) =>
      item.id === newItem.id ? newItem : item,
    );
    this.emitChange();
  }

  private removeSessionItem(id: string): void {
    this.snapshot.session = this.snapshot.session.filter(
      (item) => item.id !== id,
    );
    this.emitChange();
  }
}

export { SessionStore };
