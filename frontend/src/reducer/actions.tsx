

interface IAction {
    type: ActionType;
    payload: string;
}

export enum ActionType {
    MOVE_UP = "MOVE_UP",
    MOVE_DOWN = "MOVE_DOWN",
    MOVE_LEFT = "MOVE_LEFT",
    MOVE_RIGHT = "MOVE_RIGHT",
}

const GlobalState = {
    data: ""
};

export const MovementReducer = (state = GlobalState, action: IAction) => {
    switch (action.type) {
        case ActionType.MOVE_UP:
            return { ...state, data: action.payload };
        case ActionType.MOVE_DOWN:
            return { ...state, data: action.payload };
        case ActionType.MOVE_LEFT:
            return { ...state, data: action.payload };
        case ActionType.MOVE_RIGHT:
            return { ...state, data: action.payload };
        default:
            return state;
    }
}