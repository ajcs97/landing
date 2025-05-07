import { Slice, PayloadAction, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Epic, ofType } from "redux-observable";
import { take, tap } from "rxjs";
import { StoreState } from "./store";

export const IMAGE_ASSET_LIST_PREFIX = "STICKER_ASSET_LIST";

export type ImageAssetListItem = {
  type: string;
  id: string;
  name: string;
  src: string;
};

export const stickerAssetListEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(stickerAssetListAction.addItem.type),
    take(1),
    tap((action$) => console.log(action$.payload)),
  );

export const stickerAssetListEntity = createEntityAdapter<ImageAssetListItem>();

export const stickerAssetListSlice = createSlice({
  name: IMAGE_ASSET_LIST_PREFIX,
  initialState: stickerAssetListEntity.setAll(stickerAssetListEntity.getInitialState(), []),
  reducers: {
    initialize(state, action) {
      stickerAssetListEntity.setAll(state, action.payload);
    },
    addItem(state, action) {
      if (Array.isArray(action.payload)) {
        stickerAssetListEntity.addMany(state, action.payload);
        return;
      }
      stickerAssetListEntity.addOne(state, action.payload);
    },
    updateItem(state, action: PayloadAction<ImageAssetListItem>) {
      stickerAssetListEntity.updateOne(state, {
        id: action.payload.id,
        changes: action.payload,
      });
    },
    removeItem(state, action) {
      if (Array.isArray(action.payload)) {
        stickerAssetListEntity.removeMany(state, action.payload);
        return;
      }
      stickerAssetListEntity.removeOne(state, action.payload.id);
    },
  },
});

const stickerAssetListReducer = stickerAssetListSlice.reducer;

export const stickerAssetListSelector = stickerAssetListEntity.getSelectors(
  (state: StoreState) => state.stickerAssetList,
);
export const stickerAssetListAction = stickerAssetListSlice.actions;
export default stickerAssetListReducer;
