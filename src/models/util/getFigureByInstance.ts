import {Figure, FigureNames} from "./models/figures/Figure";
import {King} from "./models/figures/King";
import {Knight} from "./models/figures/Knight";
import {Pawn} from "./models/figures/Pawn";
import {Queen} from "./models/figures/Queen";
import {Rook} from "./models/figures/Rook";
import {Bishop} from "./models/figures/Bishop";
import {Colors} from "./models/Colors";
import {Cell} from "./models/Cell";

export function getFigureByInstance(figure: Figure, color: Colors, newCell: Cell){
  let newFigure
  switch (figure.name){
    case FigureNames.KING:
      newFigure = new King(color, newCell)
      break;
    case FigureNames.KNIGHT:
      newFigure = new Knight(color, newCell)
      break;
    case FigureNames.PAWN:
      newFigure = new Pawn(color, newCell)
      break;
    case FigureNames.QUEEN:
      newFigure = new Queen(color, newCell)
      break;
    case FigureNames.ROOK:
      newFigure = new Rook(color, newCell)
      break;
    case FigureNames.BISHOP:
      newFigure = new Bishop(color, newCell)
      break;
  }

}

