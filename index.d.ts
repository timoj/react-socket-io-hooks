export function SocketProvider(props: { uri: string, children: React.ReactNode, reducer: React.Reducer<any, any>, initialState: any }): React.FunctionComponent<{ uri: string, children: React.ReactNode, reducer: React.Reducer<any, any> }>;

export function useSocket(): SocketIOClient.Socket;

export function useSocketState(): any

export function useEmitEvent(eventName: string)
