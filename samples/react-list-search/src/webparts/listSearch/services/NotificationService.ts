import { WebPartContext } from '@microsoft/sp-webpart-base';

export type SubscriptionType = 'item' | 'category' | 'all';

export interface SubscriptionEntry {
  PartitionKey: string;
  RowKey: string;
  User: string;
  Type: SubscriptionType;
  Value: string;
}

export default class NotificationService {
  private accountUrl = '<YOUR_ACCOUNT_URL>'; // e.g. https://account.table.core.windows.net
  private tableName = 'Notifications';
  private sasToken = '<YOUR_SAS_TOKEN>'; // ?sv=...&sig=...

  constructor(private context: WebPartContext) {}

  public async register(type: SubscriptionType, value: string): Promise<void> {
    const user = this.context.pageContext.user.loginName || 'anonymous';
    const entity: SubscriptionEntry = {
      PartitionKey: encodeURIComponent(user),
      RowKey: `${Date.now()}`,
      User: user,
      Type: type,
      Value: value
    };

    const url = `${this.accountUrl}/${this.tableName}?${this.sasToken}`;
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;odata=nometadata',
        'Accept': 'application/json;odata=nometadata'
      },
      body: JSON.stringify(entity)
    });
  }
}
