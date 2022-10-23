export class Pawn {

    constructor(id,player,x,y) {
        this.id = id;
        this.player = player;
        this.x = x;
        this.y = y;
    }

    static getPawnImage(player) {
        if (player === 'Black') return 'BlackPawn.png';
        if (player === 'White') return 'WhitePawn.png';
        if (player === 'Neutron') return 'Neutron.png';
    }
}
