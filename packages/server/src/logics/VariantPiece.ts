import Position from "./Position";
import { Piece } from "./Piece";

class CyanPiece extends Piece {
  get color(): bigint {
    return 0x00ffffffn;
  }

  clone(): Piece {
    return new CyanPiece();
  }

  get nextPiecePreview() {
    return [["00ffffff", "00ffffff", "00ffffff", "00ffffff"]];
  }
  get rotations(): Position[][] {
    return [
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ],
      [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ],
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
      ],
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 0, y: 3 },
      ],
    ];
  }
}

class BluePiece extends Piece {
  get color(): bigint {
    return 0x0000ffffn;
  }

  clone(): Piece {
    return new BluePiece();
  }
  get nextPiecePreview() {
    return [
      ["0000ffff", "00000000", "00000000"],
      ["0000ffff", "0000ffff", "0000ffff"],
    ];
  }

  get rotations(): Position[][] {
    return [
      [
        { y: 0, x: 0 },
        { y: 1, x: 0 },
        { y: 1, x: 1 },
        { y: 1, x: 2 },
      ],
      [
        { y: 0, x: 2 },
        { y: 0, x: 1 },
        { y: 1, x: 1 },
        { y: 2, x: 1 },
      ],
      [
        { y: 2, x: 2 },
        { y: 1, x: 2 },
        { y: 1, x: 1 },
        { y: 1, x: 0 },
      ],
      [
        { y: 2, x: 0 },
        { y: 2, x: 1 },
        { y: 1, x: 1 },
        { y: 0, x: 1 },
      ],
    ];
  }
}

class OrangePiece extends Piece {
  get color(): bigint {
    return 0xffa500ffn;
  }

  clone(): Piece {
    return new OrangePiece();
  }
  get nextPiecePreview() {
    return [
      ["ffa500ff", "ffa500ff", "ffa500ff"],
      ["ffa500ff", "00000000", "00000000"],
    ];
  }
  get rotations(): Position[][] {
    return [
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
      [
        { x: 0, y: 2 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
        { x: 1, y: 0 },
      ],
      [
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
    ];
  }
}

class YellowPiece extends Piece {
  get color(): bigint {
    return 0xffff00ffn;
  }

  clone(): Piece {
    return new YellowPiece();
  }

  get nextPiecePreview() {
    return [
      ["ffff00ff", "ffff00ff"],
      ["ffff00ff", "ffff00ff"],
    ];
  }
  get rotations(): Position[][] {
    return [
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
      ],
    ];
  }
}

class GreenPiece extends Piece {
  get color(): bigint {
    return 0x00ff00ffn;
  }

  clone(): Piece {
    return new GreenPiece();
  }
  get nextPiecePreview() {
    return [
      ["00000000", "00ff00ff", "00ff00ff"],
      ["00ff00ff", "00ff00ff", "00000000"],
    ];
  }
  get rotations(): Position[][] {
    return [
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
      ],
      [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
      ],
      [
        { x: 0, y: 2 },
        { x: 1, y: 2 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
      ],
    ];
  }
}

class RedPiece extends Piece {
  get color(): bigint {
    return 0xff0000ffn;
  }

  clone(): Piece {
    return new RedPiece();
  }

  get nextPiecePreview() {
    return [
      ["ff0000ff", "ff0000ff", "00000000"],
      ["00000000", "ff0000ff", "ff0000ff"],
    ];
  }

  get rotations(): Position[][] {
    return [
      [
        { y: 0, x: 1 },
        { y: 1, x: 1 },
        { y: 1, x: 0 },
        { y: 2, x: 0 },
      ],
      [
        { y: 1, x: 0 },
        { y: 1, x: 1 },
        { y: 2, x: 1 },
        { y: 2, x: 2 },
      ],
      [
        { y: 0, x: 2 },
        { y: 1, x: 2 },
        { y: 1, x: 1 },
        { y: 2, x: 1 },
      ],
      [
        { y: 0, x: 0 },
        { y: 0, x: 1 },
        { y: 1, x: 1 },
        { y: 1, x: 2 },
      ],
    ];
  }
}

class PurplePiece extends Piece {
  get color(): bigint {
    return 0x800080ffn;
  }

  clone(): Piece {
    return new PurplePiece();
  }

  get nextPiecePreview() {
    return [
      ["00000000", "800080ff", "00000000"],
      ["800080ff", "800080ff", "800080ff"],
    ];
  }
  get rotations(): Position[][] {
    return [
      [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 1 },
      ],
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 2 },
      ],
      [
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 0, y: 1 },
      ],
    ];
  }
}

export {
  CyanPiece,
  BluePiece,
  YellowPiece,
  GreenPiece,
  RedPiece,
  OrangePiece,
  PurplePiece,
};
