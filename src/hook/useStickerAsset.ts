import Konva from "konva";
import { nanoid } from "nanoid";
import { decimalUpToSeven } from "../util/decimalUpToSeven";
import { useDispatch, useSelector } from "react-redux";
import { stickerAssetListAction, stickerAssetListSelector } from "../redux/stickerAssetList";

const useStickerAsset = () => {
  const dispatch = useDispatch();
  const stickerAssetList = useSelector(stickerAssetListSelector.selectAll);

  const setStickerAsset = async (stickerList: { [key: string]: any }[]) => {
    stickerList.map((image) => {
      dispatch(
        stickerAssetListAction.addItem({
          type: image["data-item-type"],
          id: image.id,
          name: image.name,
          src: image.src,
        }),
      )
    }
    );
  };

  const getAllStickerAsset = (): { [key: string]: any }[] => {

    return stickerAssetList;
  };

  const getStickerAssetSrc = (imageId: string) =>
    stickerAssetList.find((image) => image.id === imageId)?.src ?? null;

  const reduceImageSize = (base64: string, imageId?: string, callback?: (src: string) => void) => {
    Konva.Image.fromURL(base64, (imageNode: Konva.Image) => {
      let width;
      let height;
      if (imageNode.width() > imageNode.height()) {
        width = decimalUpToSeven(512);
        height = decimalUpToSeven(width * (imageNode.height() / imageNode.width()));
      } else {
        height = decimalUpToSeven(512);
        width = decimalUpToSeven(height * (imageNode.width() / imageNode.height()));
      }
      imageNode.width(width);
      imageNode.height(height);
      const newBase64 = imageNode.toDataURL({
        x: 0,
        y: 0,
        width,
        height,
        pixelRatio: 1.2,
      });
      const id = imageId ?? nanoid();
      if (callback) {
        callback(`find:${id}`);
      }
    });
  };

  return {
    setStickerAsset,
    getAllStickerAsset,
    getStickerAssetSrc,
    reduceImageSize,
  };
};

export default useStickerAsset;
