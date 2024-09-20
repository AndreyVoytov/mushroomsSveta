import Environment from '../model/enum/Environment';
import ForestType from '../model/forest/ForestType';
export default class ForestsConfiguration {

    //see ForestUtils.CellType 

    public static allForests: ForestType[] = [
			{
				"items": [
					{
						"name": "mushroom",
						"count": 6
					}
				],
				"id": "1",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "00000000000ggg000ggg0000gggg000ggg00000ggg000000",
				"bonuses": 0
			},
			{
				"items": [
					{
						"name": "mushroom",
						"count": 6
					}
				],
				"id": "2",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 8,
				"bushes": 3,
				"mask": "0000000000ggg000gggg000ggggg00gggg0000ggg0000000",
				"bonuses": 3
			},
			{
				"items": [],
				"randomItems": 5,
				"id": "3",
				"environment": 2,
				"leafType": "hexChest",
				"steps": 10,
				"mask": "00ggg0000gggg00ggggg000gggg00ggggg000gggg000ggg0",
				"bonuses": 3
			},
			{
				"items": [],
				"randomItems": 6,
				"id": "4",
				"environment": 2,
				"leafType": "hexChest",
				"steps": 10,
				"mask": "0ggg0000ggggg0ggggg0000ggggg0ggggg0000ggg0000000",
				"bonuses": 3
			},
			{
				"items": [
					{
						"name": "mushroom",
						"count": 12
					}
				],
				"randomItems": 0,
				"id": "5",
				"header": "junglesHeader",
				"environment": 5,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 3,
				"mask": "00gg0g000ggigg0giigg000giiig00ggiig00ggigg00g0gg",
				"bonuses": 3
			},
			{
				"items": [
					{
						"name": "mushroom3",
						"count": 12
					}
				],
				"id": "6",
				"header": "junglesHeader",
				"environment": 5,
				"leafType": "leaf4",
				"steps": 11,
				"bushes": 3,
				"mask": "00gggg000giiig0gijjig00ijjji0gijjig00giiig00gggg",
				"bonuses": 4
			},
			{
				"items": [
					{
						"name": "mushroom",
						"count": 9
					},
					{
						"name": "witchMushroom",
						"count": 1
					}
				],
				"id": "7",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 2,
				"mask": "0ggg0000ggggg0gggggg0gggsggggggggg00ggggg000ggg0",
				"bonuses": 3
			},
			{
				"items": [
					{
						"name": "mushroom",
						"count": 9
					}
				],
				"id": "8",
				"header": "junglesHeader",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 7,
				"bushes": 3,
				"mask": "00iigg000itigg0giiggg00ggjgg0gggiig00ggiti00ggii",
				"bonuses": 1,
				"dragonflies": 0,
			},
			{
				"items": [],
				"id": "9",
				"header": "bugForestHeader",
				"environment": 6,
				"leafType": "leaf4",
				"steps": 9,
				"bushes": 3,
				"mask": "00gggg0000ggg000gggg000giiig00iiii000giiig00gggg",
				"bonuses": 5,
				"ladybugs": [
					-3
				]
			},
			{
				"items": [
					{
						"name": "mushroom",
						"count": 10
					}
				],
				"id": "10",
				"header": "bugForestHeader",
				"environment": 6,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 2,
				"mask": "g0gg0g00ggggg0ggiigg0ggitiggggiigg00ggggg0g0gg0g",
				"bonuses": 2,
				"ladybugs": [
					-4,
					1,
					4
				]
			},
			{
				"items": [
					{
						"count": 7,
						"name": "mushroom"
					},
					{
						"count": 7,
						"name": "mushroom3"
					},
					{
						"count": 7,
						"name": "witchMushroom"
					}
				],
				"id": "11",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "000000000jjig00jjigi00iiilijggltijj0iiilij0jjigi000jjig0",
				"bonuses": 1
			},
			{
				"items": [],
				"id": "12",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf3",
				"steps":8,
				"bushes": 3,
				"mask": "0ggg0000ggggg0gggggg0ggggggggggggg00ggggg000ggg0",
				"bonuses": 7,
				"flowers": 2
			},
			{
				"items": [
					{
						"count": 10,
						"name": "mushroom"
					}
				],
				"id": "13",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 14,
				"bushes": 2,
				"mask": "0glglg00ggllgggigigig0lgggglgigigig0ggllgg0glglg",
				"bonuses": 3,
				"flowers": 4
			},
			{
				"items": [
					{
						"count": 7,
						"name": "mushroom3"
					},
				],
				"id": "14",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "0iggi000ggggg0igjjgi0jiitiijigjjgi00ggggg00iggi0",
				"bonuses": 3
			},
			{
				"items": [
					{
						"count": 5,
						"name": "mushroom3"
					},
					{
						"count": 8,
						"name": "lilly"
					}					
				],
				"id": "15",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 3,
				"mask": "00ggg0000gwwg00gwwwg00gwwwwggwwwwwg0gwwwwg0gwwwg000gggg0",
				"bonuses": 2
			},
			{
				"items": [
					{
						"count": 8,
						"name": "mushroom3"
					},
					{
						"count": 4,
						"name": "lilly"
					}
				],
				"id": "16",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 6,
				"bushes": 2,
				"mask": "0gjjg000gwtwg0ggjjgg00igwgi0ggjjgg0gwitiwggi00ig",
				"bonuses": 2
			},
			{
				"items": [
					{
						"count": 8,
						"name": "mushroom3"
					}
				],
				"id": "17",
				"header": null,
				"environment": 0,
				"leafType": "leaf4",
				"steps": 12,
				"bushes": 3,
				"mask": "0gl0lg00igiigitiijiit0igiigi0ggigg000gggg000lgl0",
				"bonuses": 1,
				"ladybugs": [
					-5,
					-2
				]
			},
			{
				"items": [
					{
						"count": 5,
						"name": "lilly"
					},
					{
						"count": 10,
						"name": "mushroom"
					}
				],
				"id": "18",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 11,
				"bushes": 3,
				"mask": "lw00ii00iw0ii0iigwjt0tjgwiiiiigwii00iwgii0iiwgjt0tjwgiiijigwii00igwwi00ggwl00000",
				"bonuses": 4,
				"ladybugs": [
					-6,
					-2
				],
				"flowers": 0
			},
			{
				"items": [],
				"id": "19",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 11,
				"bushes": 3,
				"mask": "00ggg0000gggg00gg0gg00gg00gg0gg0gg000gggg000ggg0",
				"bonuses": 2,
				// "blueberries": 22,
				"ladybugs": []
			},
			{
				"items": [
					{
						"count": 5,
						"name": "mushroom"
					}
				],
				"id": "20",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 9,
				"bushes": 2,
				"mask": "0jiljt00iiggijlgglggl0ggllgglgglggl0jiggii0tjlij",
				"bonuses": 3,
				// "blueberries": 22,
				"ladybugs": [],
				"flowers": 0
			},
			{
				"items": [
					{
						"count": 8,
						"name": "witchMushroom"
					},
					{
						"count": 8,
						"name": "lilly"
					}
				],
				"id": "21",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 7,
				"bushes": 2,
				"mask": "0ggggg00gwggwgggwwwgg0gwwwwggwwgwwg0gwggwg0ggggg",
				"bonuses": 3,
				// "blueberries": 16
			},
			{
				"items": [
					{
						"count": 6,
						"name": "mushroom"
					},
					{
						"count": 6,
						"name": "lavanda"
					}
				],
				"id": "22",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 0,
				"mask": "00mmm0000mmmm00mmmmm00lmmmml0iiiii000ijji000iii0",
				"bonuses": 2
			},
			{
				"items": [
					{
						"count": 8,
						"name": "mushroom3"
					},
					{
						"count": 4,
						"name": "lavanda"
					}
				],
				"id": "23",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 14,
				"mask": "0ggmgg00gmggmggmmimmg0miijimmmjtjmm0mijjimgmmimmg0gmggmg0ggmgg00",
				"bonuses": 2
			},
			{
				"items": [
					{
						"count": 6,
						"name": "lavanda"
					},
					{
						"count": 5,
						"name": "witchMushroom"
					}
				],
				"id": "24",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 11,
				"bushes": 2,
				"mask": "0mmmm00ggmmmggigmmgk0KjgmgiKkgmmgK0ggmmmgg0mmmm0",
				"bonuses": 3,
				"cankerberries": 8
			},
			{
				"items": [
					{
						"count": 6,
						"name": "mushroom3"
					},
					{
						"count": 8,
						"name": "lavanda"
					},
					{
						"count": 10,
						"name": "lilly"
					}
				],
				"id": "25",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 13,
				"mask": "0gggg000mmwmm0mwwwwm0mmwwwmmmmwwmm0gmwwwmggwmmwg00gmmmg0mwwwwm00mwwwm00mggm000mgggm0mgwwgm00gwwwg00wwww0",
				"bonuses": 7
			},
			{
				"items": [
					{
						"count": 7,
						"name": "mushroom3"
					},
					{
						"count": 6,
						"name": "lilly"
					},
					{
						"count": 5,
						"name": "lavanda"
					}
				],
				"id": "26",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 13,
				"bushes": 3,
				"mask": "00gmmm000gmmmm0gmmmmm00gmmmm00gmmm0000ggg000wwwg000wwwwg0wwwwwg00wwwwg00wwwg0000",
				"bonuses": 2
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 21,
						"name": "lavanda"
					}
				],
				"id": "27",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 17,
				"mask": "0mm0mm00BmmmmBBAB0BAB0DmmmmD0AFmFA00mDAADmmBAdABm0EmDDmE0mBBBm00mmBBmm0BmdmB000DAAD00000",
				"bonuses": 6,
				"cankerberries": 0,
				hardLevel:true,
				"ladybugs": [
					-2,
					-5,
					28,
					34,
					17
				]
			},
			{
				"items": [
					{
						"count": 7,
						"name": "witchMushroom"
					}
				],
				"id": "28",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 14,
				"bushes": 3,
				"mask": "00ggg000iiigii0ijigi00giiiig0igiji00iigiii00ggg0",
				"bonuses": 0,
				"cankerberries": 15,
				// "blueberries": 25
			},
			{
				"items": [
					{
						"count": 5,
						"name": "lilly"
					}
				],
				"id": "29",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 15,
				"mask": "00000000ww00wwwwgggww0wllllwwpipipw0gliilg0wlllw00wwggww0w0g0w00",
				"bonuses": 2,
				// "blueberries": 17
			},
			{
				"items": [
					{
						"count": 3,
						"name": "lavanda"
					},
					{
						"count": 8,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "mushroom3"
					}
				],
				"id": "30",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 3,
				"mask": "0000g0000gggg000gmmgg00gmgmg0ggmmg0000gggg000g00",
				"bonuses": 1
			},
			{
				"items": [
					{
						"name": "witchMushroom",
						"count": 7
					},
					{
						"count": 6,
						"name": "lilly"
					}
				],
				"id": "31",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 11,
				"bushes": 2,
				"mask": "0i0jww00ijjwtw0wpwwwg0wwwwgg0ggwwww0gwwwpw0wtwjil00wwi0i",
				"bonuses": 2,
				"cankerberries": 7
			},
			{
				"items": [
					{
						"count": 25,
						"name": "mushroom"
					}
				],
				"id": "32",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 15,
				"bushes": 3,
				"mask": "000ggg0000gppg00gjtpg000gjpg000gpg0000gpjg00gpljg000gpjg000gpg0000gjpg00gjlpg000gjpg000gpg0000gpjg00gptjg000gppg000ggg00",
				"bonuses": 4
			},
			{
				"items": [
					{
						"count": 5,
						"name": "witchMushroom"
					},
					{
						"count": 5,
						"name": "amanita"
					},
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"id": "33",
				"header": null,
				"environment": 1,
				"leafType": "leaf3",
				"steps": 12,
				"bushes": 3,
				"mask": "00000000g0gg0ggglllgg0gliilg0lisil00gliilggglllgg0g0gg0g",
				"bonuses": 2,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 20,
						"name": "lilly"
					},
					{
						"count": 24,
						"name": "mushroom"
					}
				],
				"id": "34",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 10,
				"bushes": 2,
				"mask": "0ww00gg0gwwlgg0gwwlgg0tgwwlg0gwwlgg0gwwlgg0wwligg0gwwlgg0gwwlgg0tgwwlg0gwwlgg0gwwlgg0wwligg0gwwlgg0gwwlgg0tgwwlg0gwwlgg0gwwlgg0ww00gg000",
				"bonuses": 7,
				"flowers": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "amanita"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 14,
						"name": "witchMushroom"
					},
					{
						"count": 0,
						"name": "mushroom3"
					}
				],
				"id": "35",
				"header": null,
				"environment": 1,
				"leafType": "leaf1",
				"steps": 12,
				"bushes": 2,
				"mask": "c0gg0c0gggggggggccgg0ggcccggggccgg0gggggggc0gg0c",
				"bonuses": 2,
				"jellyMushrooms": 11,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 17,
						"name": "witchMushroom"
					},
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"id": "36",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 12,
				"bushes": 2,
				"mask": "0cccc0000ccc00lccccl0glccclllgccgl0lgggggglggggl00lgggl0",
				"bonuses": 2,
				"jellyMushrooms": 16
			},
			{
				"items": [
					{
						"count": 9,
						"name": "witchMushroom"
					},
					{
						"count": 8,
						"name": "lilly"
					}
				],
				"id": "37",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 12,
				"hardLevel":true,
				"mask": "glgglg0lgglggl0000000wwwwwwwwwwwww00000000lgllgl0lglglgl0000000wwwwwwwwwwwww00000000lgllgl0glggglg0000000wwwwwwwwwwwww00",
				"bonuses": 4
			},
			{
				"items": [
					{
						"count": 17,
						"name": "witchMushroom"
					}
				],
				"id": "38",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 11,
				"bushes": 3,
				"mask": "0g00g000gilig0giaaig0giaaaigglaalg0gglalggggllgg00g0l0g0",
				"bonuses": 3,
				"acorns": 8
			},
			{
				"items": [
					{
						"count": 5,
						"name": "mushroom"
					},
					{
						"count": 5,
						"name": "witchMushroom"
					}
				],
				"id": "39",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 10,
				"bushes": 2,
				"mask": "al00la0llcgcllgcllcg0ggcacgggcllcg0llcgcllal00la",
				"bonuses": 3,
				"acorns": 5
			},
			{
				"items": [
					{
						"count": 5,
						"name": "mushroom"
					},
					{
						"count": 5,
						"name": "mushroom3"
					},
					{
						"count": 3,
						"name": "lilly"
					}
				],
				"id": "40",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 7,
				"mask": "00000000ggggg0gllllg00gglgg000gg000t0lgl0tllggll00ccccc0wwwwww000www0000ww000000w0000000",
				"bonuses": 3
			},
			{
				"items": [
					{
						"count": 10,
						"name": "mushroom"
					},
					{
						"count": 10,
						"name": "witchMushroom"
					}
				],
				"id": "41",
				"header": null,
				"environment": 1,
				"leafType": "leaf1",
				"steps": 7,
				"bushes": 3,
				"mask": "l0000l0gggggggllglll0glgrglglllgll0gggggggl0000l",
				"bonuses": 2
			},
			{
				"items": [
					{
						"count": 12,
						"name": "mushroom3"
					}
				],
				"id": "42",
				"header": null,
				"environment": 1,
				"leafType": "leaf3",
				"steps": 11,
				"bushes": 2,
				"mask": "gg0lll0rgKgyKggKllKl0lKKgKKllKglKg0lKrlKgqlll0gg",
				"bonuses": 2,
				"cankerberries": 24
			},
			{
				"items": [
					{
						"count": 24,
						"name": "witchMushroom"
					}
				],
				"id": "43",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 11,
				"bushes": 3,
				"mask": "lQ00Yl0lal0lalllllll0gagagagggaagg0gagagagllllll0lal0lalll00ll00",
				"bonuses": 3,
				"acorns": 12,
				"hardLevel":true

			},
			{
				"items": [
					{
						"count": 7,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "amanita"
					},
					{
						"count": 7,
						"name": "witchMushroom"
					}
				],
				"id": "44",
				"header": null,
				"environment": 1,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 3,
				"mask": "0ggggg00wgwwgw0wwwww00gwwwwg0wgwgw000gwwg00wwgww0000gg00",
				"bonuses": 1,
				// "blueberries": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "witchMushroom"
					},
					{
						"count": 6,
						"name": "mushroom3"
					},
					{
						"count": 9,
						"name": "mushroom"
					}
				],
				"id": "45",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 10,
				"bushes": 3,
				"mask": "0g00g00ggggggggaggag0lggggglllggll0allglla00gg00",
				"bonuses": 2,
				"acorns": 4
			},
			{
				"items": [
					{
						"count": 7,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "mushroom3"
					}
				],
				"id": "46",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 14,
				"mask": "gg0ggg0gal0lagggw0gg0glwwwlggwwwwg0glwwwlggg0wgg0gal0lagggg0gg00",
				"bonuses": 3,
				// "blueberries": 24,
				"acorns": 4
			},
			{
				"items": [
					{
						"count": 8,
						"name": "poleno"
					},
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"id": "47",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "0iggi000gigig0ggiigg0lligillggiigg00gigig00iggi0",
				"bonuses": 2,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 5,
						"name": "lavanda"
					},
					{
						"count": 3,
						"name": "lilly"
					},
					{
						"count": 6,
						"name": "mushroom3"
					}
				],
				"id": "48",
				"header": null,
				"environment": 0,
				"leafType": "leaf3",
				"steps": 9,
				"bushes": 2,
				"mask": "mmmmmm0gmwwwmgimwwmi0gimtmiggimmig0gg000ggggmmgg000ggg00",
				"bonuses": 1,
				"flowers": 0
			},
			{
				"items": [
					{
						"count": 4,
						"name": "mushroom"
					},
					{
						"count": 4,
						"name": "lavanda"
					}
				],
				"id": "49",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 2,
				"mask": "m0m0m0m0mmmmmm0mcmcm00gggggg0ggggg0000gg0000ggg0",
				"bonuses": 2
			},
			{
				"items": [
					{
						"count": 4,
						"name": "mushroom"
					},
					{
						"count": 4,
						"name": "witchMushroom"
					}
				],
				"id": "50",
				"header": null,
				"environment": 0,
				"leafType": "leaf4",
				"steps": 11,
				"bushes": 3,
				"mask": "gg00gg0gcg0gcggg00gg00g000g0kckckc0gcccccgckckck",
				"bonuses": 2,
				"cankerberries": 6
			},
			{
				"items": [
					{
						"count": 0,
						"name": "witchMushroom"
					},
					{
						"count": 11,
						"name": "mushroom3"
					}
				],
				"id": "51",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 9,
				"bushes": 2,
				"mask": "gl00lg0gliiilglijjil0lijajillijjil0gliiilggl00lg",
				"bonuses": 5,
				"flowers": 4,
				"acorns": 0,
				"dragonflies": 0,
				hardLevel: true
			},
			{
				"items": [
					{
						"count": 17,
						"name": "mushroom"
					},
					{
						"count": 12,
						"name": "lilly"
					}
				],
				"id": "52",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 8,
				"mask": "ggjj0w0ggjww0wgjw0ww0ggjw0wjjjwwjj0jw0wjggww0wjg0w0wwjggw0jjgg00",
				"bonuses": 3
			},
			{
				"items": [
					{
						"count": 7,
						"name": "lavanda"
					},
					{
						"count": 4,
						"name": "lilly"
					}
				],
				"id": "53",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 2,
				"mask": "m0mm0m0mmmwmmmmmwwmm0lllwllllKllll0iggiggk0wwww0",
				"bonuses": 3,
				"cankerberries": 3
			},
			{
				"items": [
					{
						"count": 4,
						"name": "lavanda"
					},
					{
						"count": 3,
						"name": "lilly"
					}
				],
				"id": "54",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"mask": "0mmmg00gwmmmwmmwmmwm0lwtmwmlllllll0mmlllwmmwmmwm0mwmmmwmlwmmwl00ltgtl00llll00000",
				"bonuses": 4,
				"ladybugs": [
					0,
					5
				]
			},
			{
				"items": [
					{
						"count": 19,
						"name": "mushroom"
					},
					{
						"count": 15,
						"name": "lilly"
					}
				],
				"id": "55",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 2,
				"mask": "0l00l00llgwglllgwwgl0QljwjlYlgwwgl0lliwilllgwwgl0lljwjlRlgwwgl0lliwilllgwwgl0YljwjlQlgwwgl0llgwgll0l00l0",
				"bonuses": 5
			},
			{
				"items": [
					{
						"count": 3,
						"name": "lilly"
					}
				],
				"id": "56",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 2,
				"mask": "mmiiw00mjijiw0jjikw0000jtj000wkijj00wijijm0wiimm",
				"bonuses": 2,
				"cankerberries": 2,
				// "blueberries": 9
			},
			{
				"items": [
					{
						"count": 10,
						"name": "mushroom"
					},
					{
						"count": 10,
						"name": "witchMushroom"
					}
				],
				"id": "57",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 11,
				"bushes": 3,
				"mask": "00000000ll0ll0lhiihl0giiliigigllgi0giiliiglhiihl00ll0ll0",
				"bonuses": 4,
				"honey": 24,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 6,
						"name": "lavanda"
					},
					{
						"count": 17,
						"name": "witchMushroom"
					}
				],
				"id": "58",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 10,
				"mask": "lg0lAA0glglA0AghhlmA0glhgmlgglmmlg0glmghlgAmlhhg0A0AlglgAAl0gl00",
				"bonuses": 3,
				"honey": 22,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 24,
						"name": "mushroom"
					}
				],
				"id": "59",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 14,
				"bushes": 3,
				"mask": "lg00gl0l00a00laaaaaa0giiaiiggaaaag0giiaiigaaaaaa0i0gag0ilg00gl00",
				"bonuses": 4,
				"acorns": 0,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 5,
						"name": "mushroom3"
					},
					{
						"count": 5,
						"name": "lavanda"
					},
					{
						"count": 5,
						"name": "witchMushroom"
					}
				],
				"id": "60",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 15,
				"mask": "mc00cm0mgl0lgmmc00cm0mgl0lgmmc00cm0mgl0lgmmc00cm0mgl0lgmmc00cm0mgl0lgmmc00cm0mgl0lgmmc00cm0mgl0lgmmc00cm",
				"bonuses": 4,
				hardLevel: true
			},
			{
				"items": [
					{
						"count": 13,
						"name": "mushroom"
					},
					{
						"count": 13,
						"name": "mushroom3"
					}
				],
				"id": "61",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 7,
				"bushes": 3,
				"mask": "lg00gl0lglglglllggll0lflglflllggll0lglglgllg00gl",
				"bonuses": 2,
				"dragonflies": 2
			},
			{
				"items": [
					{
						"count": 15,
						"name": "mushroom"
					}
				],
				"id": "62",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 2,
				"mask": "0000000gj0t0jgggjjgg0fljljlfglfflg0fljljlfggjjgg0gj0t0jg",
				"bonuses": 3,
				// "blueberries": 20,
				"dragonflies": 6
			},
			{
				"items": [
					{
						"count": 15,
						"name": "lavanda"
					},
					{
						"count": 23,
						"name": "lilly"
					}
				],
				"id": "63",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 7,
				"mask": "mm00mm00mwwwm00mwwm00mmwwwmmmwwwwm00mwwwm00mwwm00mmwwwmmmwwwwm00mwwwm00mwwm00mmwwwmmmwwwwm00mwwwm00mwwm00mmwwwmmm0ww0m00",
				"bonuses": 8
			},
			{
				"items": [
					{
						"count": 0,
						"name": "lilly"
					},
					{
						"count": 4,
						"name": "mushroom"
					}
				],
				"id": "64",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "0wwwww00wjiijwwiljiiw0wjjljwwjiiliw0wjijjw0wlliw000wwww0",
				"bonuses": 15,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"randomItems": 9,
				"id": "65",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 9,
				"bushes": 2,
				"mask": "000000000000000gggg000ggggg0gg00gg00gg0gg00gggg0000ggg00",
				"bonuses": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"randomItems": 6,
				"id": "66",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 8,
				"bushes": 3,
				"mask": "00gij0000ggij00gglii00ggilgg0jilgg000iigg000jig0",
				"bonuses": 2,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"randomItems": 12,
				"id": "67",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 8,
				"mask": "000000000g0gg00gggg0000gg0ggggg0gg00ggg00000ggg000000ggg0gg0ggg0gg0gg000gggg000gg0g00000",
				"bonuses": 2,
				"waterCenter": null
			},
			{
				"items": [],
				"randomItems": 12,
				"id": "68",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 13,
				"bushes": 1,
				"mask": "0000000000g0000gffg00gflllfggljjlg0gflflfggljjlg0gflllfg0gffg0000g0g0000",
				"bonuses": 0,
				// "blueberries": 0,
				"flowers": 0,
				"dragonflies": 11
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"randomItems": 9,
				"id": "69",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 7,
				"bushes": 3,
				"mask": "0g0l0g00ggiigg0iglgi00tjlljt0iglgi00ggiigg0g0l0g",
				"bonuses": 1,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"randomItems": 7,
				"id": "70",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 6,
				"mask": "00Rgl0000gljR00Qiijg000gliiY00Riig000gliR00Yiijg000glilQ00Qllg0000glQ000",
				"bonuses": 1,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"randomItems": 6,
				"id": "71",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 9,
				"bushes": 1,
				"mask": "00aga0000agag00agaga00gagaga0gaaaa000gggg000ggg0",
				"bonuses": 1,
				"acorns": 0,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"randomItems": 10,
				"id": "72",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 15,
				"mask": "0ggggg00QgQYgYgaaaaaR0gaaaag0gaaag000gaag000gag00000ll00",
				"bonuses": 1,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"randomItems": 12,
				"id": "73",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 9,
				"mask": "0g000g00gg00glgggggii0ggllfi0gfiji00gliffjggfijif0gl00fl0g000i00",
				"bonuses": 4,
				"dragonflies": 7,
				"waterCenter": null,
				hardLevel: true
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "t27"
					},
					{
						"count": 16,
						"name": "t25"
					}
				],
				"id": "74",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 11,
				"mask": "0ggggg00llllll0ipipi00itptpt0lplpl00iiiiii0lpipl00lp00pl0l000l00lp00pl0lpipl000llll00000",
				"bonuses": 4,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "t24"
					},
					{
						"count": 5,
						"name": "t1"
					},
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"id": "75",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 9,
				"bushes": 3,
				"mask": "0gg00000ghggg00ghghg000ggghg0ghggg000ghg0000gg00",
				"bonuses": 0,
				"honey": 21,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"randomItems": 10,
				"id": "76",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 8,
				"bushes": 3,
				"mask": "00000000000000000000000gggg00giaig00ga00aggi0g0ig0ga00ag0giaig000gggg000",
				"bonuses": 1,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 11,
						"name": "t27"
					}
				],
				"id": "77",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 6,
				"hardLevel":true,
				"mask": "0gg0gg00giggiggigggig0gggggggigggig0giggig0gg0gg",
				"bonuses": 2,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "amanita"
					},
					{
						"count": 11,
						"name": "t24"
					}
				],
				"id": "78",
				"header": null,
				"environment": 2,
				"leafType": "hexChest",
				"steps": 10,
				"bushes": 3,
				"mask": "0gg0gg000gggg0ggggggg0ggggggggggggg00gggg00gg0gg",
				"bonuses": 2,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 10,
						"name": "lavanda"
					},
					{
						"count": 11,
						"name": "mushroom4"
					},
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"id": "79",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 2,
				"mask": "0gmmmm00ggmmmmggmmmmm0gggmmmgggmmmm0ggggmm0gggmm000gggg0",
				"bonuses": 3
			},
			{
				"items": [
					{
						"count": 15,
						"name": "witchMushroom"
					}
				],
				"id": "80",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 8,
				"bushes": 3,
				"mask": "000000000ggg00ggaagg0giaiaiggiiiig0gihihiggghhgg000ggg00",
				"bonuses": 1,
				"acorns": 4,
				"honey": 12,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 3,
						"name": "lilly"
					},
					{
						"count": 16,
						"name": "mushroom3"
					}
				],
				"id": "81",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 11,
				"mask": "0l000l00lgiiglgijzfig0izwwzigjwwwjg0izwwzigifzjig0lgiigl0l000l00",
				"bonuses": 3,
				"dragonflies": 2
			},
			{
				"items": [
					{
						"count": 8,
						"name": "lavanda"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 7,
						"name": "mushroom4"
					}
				],
				"id": "82",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 6,
				"bushes": 3,
				"mask": "0000000000mim000miim000mifim0miiiim00mifim00miim0000mim0",
				"bonuses": 3,
				"dragonflies": 2
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 13,
						"name": "witchMushroom"
					}
				],
				"id": "83",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "0g0gg000g0ggg0gggggg0gggvggggggggg00ggg0g00gg0g0",
				"bonuses": 1
			},
			{
				"items": [
					{
						"count": 10,
						"name": "lavanda"
					},
					{
						"count": 3,
						"name": "lilly"
					}
				],
				"id": "84",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 2,
				"mask": "00000000mm0mm0mmwwmm0mmwwwmmmvwwvm0mmwwwmmmmwwmm00mm0mm0",
				"bonuses": 3
			},
			{
				"items": [
					{
						"count": 0,
						"name": "goldRoot"
					},
					{
						"count": 17,
						"name": "mushroom"
					}
				],
				"separators": [
					{
						"X": 2,
						"Y": 4,
						"type": 1
					},
					{
						"X": 1,
						"Y": 4,
						"type": 4
					},
					{
						"X": 2,
						"Y": 5,
						"type": 3
					},
					{
						"X": 2,
						"Y": 4,
						"type": 2
					},
					{
						"X": 3,
						"Y": 4,
						"type": 5
					},
					{
						"X": 4,
						"Y": 5,
						"type": 0
					},
					{
						"X": 3,
						"Y": 4,
						"type": 4
					},
					{
						"X": 4,
						"Y": 4,
						"type": 1
					},
					{
						"X": 1,
						"Y": 2,
						"type": 4
					},
					{
						"X": 2,
						"Y": 2,
						"type": 1
					},
					{
						"X": 2,
						"Y": 1,
						"type": 5
					},
					{
						"X": 2,
						"Y": 2,
						"type": 0
					},
					{
						"X": 4,
						"Y": 1,
						"type": 2
					},
					{
						"X": 3,
						"Y": 2,
						"type": 3
					},
					{
						"X": 4,
						"Y": 2,
						"type": 1
					},
					{
						"X": 3,
						"Y": 2,
						"type": 4
					},
					{
						"X": 1,
						"Y": 3,
						"type": 4
					},
					{
						"X": 2,
						"Y": 3,
						"type": 1
					},
					{
						"X": 5,
						"Y": 3,
						"type": 1
					},
					{
						"X": 4,
						"Y": 3,
						"type": 4
					},
					{
						"X": 1,
						"Y": 2,
						"type": 2
					},
					{
						"X": 1,
						"Y": 3,
						"type": 3
					},
					{
						"X": 5,
						"Y": 3,
						"type": 2
					},
					{
						"X": 4,
						"Y": 4,
						"type": 3
					},
					{
						"X": 3,
						"Y": 5,
						"type": 4
					},
					{
						"X": 4,
						"Y": 5,
						"type": 1
					},
					{
						"X": 2,
						"Y": 1,
						"type": 4
					},
					{
						"X": 3,
						"Y": 1,
						"type": 1
					},
					{
						"X": 5,
						"Y": 3,
						"type": 5
					},
					{
						"X": 5,
						"Y": 4,
						"type": 0
					},
					{
						"X": 0,
						"Y": 2,
						"type": 5
					},
					{
						"X": 1,
						"Y": 3,
						"type": 0
					},
					{
						"X": 2,
						"Y": 0,
						"type": 5
					},
					{
						"X": 3,
						"Y": 1,
						"type": 0
					},
					{
						"X": 3,
						"Y": 5,
						"type": 5
					},
					{
						"X": 3,
						"Y": 6,
						"type": 0
					}
				],
				"id": "85",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 2,
				"mask": "g0ig0i0ggiiiggiiiiig0giiKiiggiiiii0igiiiggg0gi0g",
				"bonuses": 4,
				"cankerberries": 2,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 10,
						"name": "lavanda"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 11,
						"name": "goldRoot"
					}
				],
				"separators": [
					{
						"X": 3,
						"Y": 4,
						"type": 0
					},
					{
						"X": 3,
						"Y": 3,
						"type": 5
					},
					{
						"X": 3,
						"Y": 2,
						"type": 5
					},
					{
						"X": 4,
						"Y": 3,
						"type": 0
					},
					{
						"X": 1,
						"Y": 2,
						"type": 5
					},
					{
						"X": 2,
						"Y": 3,
						"type": 0
					},
					{
						"X": 1,
						"Y": 3,
						"type": 5
					},
					{
						"X": 1,
						"Y": 4,
						"type": 0
					},
					{
						"X": 5,
						"Y": 4,
						"type": 0
					},
					{
						"X": 5,
						"Y": 3,
						"type": 5
					},
					{
						"X": 5,
						"Y": 2,
						"type": 5
					},
					{
						"X": 6,
						"Y": 3,
						"type": 0
					}
				],
				"id": "86",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 2,
				"mask": "mm000mm0gmmmmigPmPmPi0iiiiiiiPmPmPg0immmmgmm000mm0000000",
				"bonuses": 3,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "witchMushroom"
					},
					{
						"count": 11,
						"name": "goldRoot"
					}
				],
				"separators": [
					{
						"X": 1,
						"Y": 2,
						"type": 5
					},
					{
						"X": 2,
						"Y": 3,
						"type": 0
					},
					{
						"X": 4,
						"Y": 3,
						"type": 0
					},
					{
						"X": 3,
						"Y": 2,
						"type": 5
					},
					{
						"X": 4,
						"Y": 3,
						"type": 5
					},
					{
						"X": 4,
						"Y": 4,
						"type": 0
					},
					{
						"X": 1,
						"Y": 3,
						"type": 5
					},
					{
						"X": 1,
						"Y": 4,
						"type": 0
					},
					{
						"X": 2,
						"Y": 3,
						"type": 1
					},
					{
						"X": 1,
						"Y": 3,
						"type": 4
					},
					{
						"X": 3,
						"Y": 3,
						"type": 1
					},
					{
						"X": 2,
						"Y": 3,
						"type": 4
					},
					{
						"X": 3,
						"Y": 3,
						"type": 5
					},
					{
						"X": 3,
						"Y": 4,
						"type": 0
					},
					{
						"X": 3,
						"Y": 3,
						"type": 4
					},
					{
						"X": 4,
						"Y": 3,
						"type": 1
					},
					{
						"X": 2,
						"Y": 4,
						"type": 0
					},
					{
						"X": 2,
						"Y": 3,
						"type": 5
					},
					{
						"X": 2,
						"Y": 2,
						"type": 5
					},
					{
						"X": 3,
						"Y": 3,
						"type": 0
					},
					{
						"X": 5,
						"Y": 3,
						"type": 0
					},
					{
						"X": 4,
						"Y": 2,
						"type": 5
					},
					{
						"X": 5,
						"Y": 3,
						"type": 1
					},
					{
						"X": 4,
						"Y": 3,
						"type": 4
					},
					{
						"X": 1,
						"Y": 2,
						"type": 4
					},
					{
						"X": 2,
						"Y": 2,
						"type": 1
					},
					{
						"X": 2,
						"Y": 2,
						"type": 4
					},
					{
						"X": 3,
						"Y": 2,
						"type": 1
					},
					{
						"X": 2,
						"Y": 4,
						"type": 1
					},
					{
						"X": 1,
						"Y": 4,
						"type": 4
					},
					{
						"X": 0,
						"Y": 4,
						"type": 4
					},
					{
						"X": 1,
						"Y": 4,
						"type": 1
					},
					{
						"X": 4,
						"Y": 2,
						"type": 1
					},
					{
						"X": 3,
						"Y": 2,
						"type": 4
					},
					{
						"X": 2,
						"Y": 4,
						"type": 4
					},
					{
						"X": 3,
						"Y": 4,
						"type": 1
					},
					{
						"X": 5,
						"Y": 2,
						"type": 1
					},
					{
						"X": 4,
						"Y": 2,
						"type": 4
					},
					{
						"X": 3,
						"Y": 4,
						"type": 4
					},
					{
						"X": 4,
						"Y": 4,
						"type": 1
					}
				],
				"id": "87",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 7,
				"bushes": 3,
				"mask": "0gggg000ggggg0ghhhhg0ghggghgghhhhg00ggggg00gggg0",
				"bonuses": 2,
				"cankerberries": 0,
				"honey": 24,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 9,
						"name": "witchMushroom"
					},
					{
						"count": 8,
						"name": "lavanda"
					}
				],
				"id": "88",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 14,
				"mask": "mmla0m0mmml0mmm0glmm0gg0ggmmg0lggg0aglllgagmtm0g0g0mm0ggg0mm0g0gg0mm0gg0mtmg0aglllgallgl0m0gmlmmmmmmammm0mm0mm0m",
				"bonuses": 3,
				"acorns": 6,
				hardLevel: true
			},
			{
				"items": [
					{
						"count": 11,
						"name": "mushroom3"
					},
					{
						"count": 9,
						"name": "lilly"
					}
				],
				"id": "89",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 2,
				"mask": "c0c0www0gggwwgcggwwgc0cwwwwccgwwggc0gwwgggwww0c0c0000000",
				"bonuses": 3,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 10,
						"name": "witchMushroom"
					},
					{
						"count": 7,
						"name": "goldRoot"
					}
				],
				"id": "90",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 10,
				"mask": "0llll00ll000llgiiiiR0liaaailgiiiig0liaaailRiiiig0ll000ll0llll000",
				"bonuses": 3,
				"acorns": 6,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 15,
						"name": "lilly"
					},
					{
						"count": 9,
						"name": "goldRoot"
					},
					{
						"count": 11,
						"name": "mushroom3"
					}
				],
				"id": "91",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 16,
				"mask": "lw0wal0cww0wwclaw0wl0clww0wclgw0wa0caw0wwclw0wgl0clw0wwclww0wl0claw0wclww0wl0clw0wwclw0wal0clw0wwclww0wl0cagw0wclgw0wl00",
				"bonuses": 6,
				"acorns": 0
			},
			{
				"items": [
					{
						"count": 4,
						"name": "lavanda"
					},
					{
						"count": 3,
						"name": "lilly"
					},
					{
						"count": 4,
						"name": "witchMushroom"
					}
				],
				"id": "92",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 12,
				"bushes": 2,
				"mask": "mmmmmm0mmmwmmmmmwwmm00wwwww0iiwwli0iiiwiiiiiiiii",
				"bonuses": 2,
				"cankerberries": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "strawberry"
					},
					{
						"count": 0,
						"name": "blackberry"
					},
					{
						"count": 0,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 0,
						"name": "mushroom4"
					},
					{
						"count": 5,
						"name": "mushroom5"
					}
				],
				"interactiveItems":[
					{
						"count": 5,
						"name": "shell"
					}
				],
				"separators": [],
				"id": "93",
				"header": null,
				"environment": 4,
				"leafType": "leaf4",
				"steps": 10,
				"bushes": 3,
				"mask": "0gggg0002gggg022gggg02220ggg2222gg002222g0022220",
				"bonuses": 2,
				"cankerberries": 0,
				// "blueberries": 0,
				// "pearls": 5,
				"ladybugs": [],
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 7,
						"name": "lilly"
					}
				],
				"interactiveItems":[
					{
						"count": 7,
						"name": "shell"
					}
				],
				"id": "94",
				"header": null,
				"environment": 4,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 3,
				"mask": "02ww220022www22www222022www22www222022www202ww22",
				"bonuses": 3,
				// "pearls": 7,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "amanita"
					}
				],
				"interactiveItems":[
					{
						"count": 6,
						"name": "shell"
					}
				],
				"id": "95",
				"header": null,
				"environment": 4,
				"leafType": "leaf1",
				"steps": 7,
				"bushes": 3,
				"mask": "00000000022000022200000220000000220022022222202200220000",
				"bonuses": 1,
				// "pearls": 6,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 11,
						"name": "amanita"
					}
				],
				"interactiveItems":[
					{
						"count": 14,
						"name": "shell"
					}
				],
				"id": "96",
				"header": null,
				"environment": 4,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "000000000000000ggggg00222222022222000000000ggggg00222222022222000000000ggggg00222222022222000000",
				"bonuses": 3,
				// "pearls": 14,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 5,
						"name": "lilly"
					}
				],
				"interactiveItems":[
					{
						"count": 5,
						"name": "shell"
					}
				],
				"id": "97",
				"header": null,
				"environment": 4,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 3,
				"mask": "022220002www202wwww202wwbww22wwww2002www20022220",
				"bonuses": 2,
				// "pearls": 5,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 11,
						"name": "lilly"
					}
				],
				"interactiveItems":[
					{
						"count": 9,
						"name": "shell"
					}
				],
				"id": "98",
				"header": null,
				"environment": 4,
				"leafType": "leaf3",
				"steps": 11,
				"mask": "220www0220wwww20w22w02ww222ww2222w0w222ww2w22w020wwww022www02200",
				"bonuses": 2,
				// "pearls": 9,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 7,
						"name": "lavanda"
					},
					{
						"count": 10,
						"name": "lilly"
					}
				],
				"id": "99",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 7,
				"mask": "m0mm0m0wmmwmmwwmbwmb0wwwwwwwbmwbmw0wmmwmmwm0mm0m",
				"bonuses": 1
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 10,
						"name": "wheat"
					}
				],
				"id": "100",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 3,
				"mask": "00l0l000glgglg0lgggl000gggg00lgggl00glgglg00l0l0",
				"bonuses": 2,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 15,
						"name": "lilly"
					},
					{
						"count": 11,
						"name": "wheat"
					}
				],
				"id": "101",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 3,
				"mask": "000000000www00gwwwgg0ggwwwggggwwwg0ggwwwgggwwwgg00gwwwg00gwww000",
				"bonuses": 1,
				"ladybugs": [
					8,
					12,
					3,
					2
				]
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 12,
						"name": "wheat"
					},
					{
						"count": 8,
						"name": "lavanda"
					}
				],
				"id": "102",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 7,
				"bushes": 2,
				"mask": "m0gg0m0amgggmaammmma0aammmaaammmma0amgggmam0gg0m",
				"bonuses": 2,
				"acorns": 0,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 11,
						"name": "lavanda"
					},
					{
						"count": 0,
						"name": "witchMushroom"
					},
					{
						"count": 0,
						"name": "amanita"
					},
					{
						"count": 10,
						"name": "wheat"
					}
				],
				"id": "103",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 12,
				"mask": "i0mm0l0mfm0lifmmmill0mfimjfllimmil0lfimfimllimim0fil0mfml0mm0l00",
				"bonuses": 3,
				"dragonflies": 8
			},
			{
				"items": [
					{
						"count": 11,
						"name": "wheat"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 8,
						"name": "witchMushroom"
					}
				],
				"id": "104",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 10,
				"bushes": 3,
				"hardLevel":true,
				"mask": "0ijg0000iKjg000iVjj0000gjKj000gjgg0000gjjj000jKjV000gjgj00gjjg000gjKj00ijjV000jKjg000Vjg",
				"bonuses": 3,
				"cankerberries": 10,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 13,
						"name": "mushroom"
					}
				],
				"separators": [],
				"id": "105",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "0aaaa000aaaaa0aaaaaa0laaaaalllllll000ggg000gggg0000ggg00",
				"bonuses": 3,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 8,
						"name": "lilly"
					},
					{
						"count": 6,
						"name": "lavanda"
					}
				],
				"id": "106",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 7,
				"bushes": 3,
				"mask": "00000000mm0000mww0mm0mwwwwwmwwwwww0mwwwwwmmm0wwm00000mm0",
				"bonuses": 3,
				// "pearls": 0,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 15,
						"name": "mushroom3"
					},
					{
						"count": 15,
						"name": "lilly"
					}
				],
				"id": "107",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 11,
				"mask": "wg00gw0wbgggwwwggggw0ggwawgggbwwwg0gwwawwggggggg0gwwawwggwwwbg0ggwawggwggggw0wwgggbwwg00gw000000",
				"bonuses": 3,
				"acorns": 0,
				hardLevel: true
			},
			{
				"items": [
					{
						"count": 9,
						"name": "mushroom"
					}
				],
				"id": "108",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 6,
				"mask": "00glg000tliiililgiilt0jlhhgi0jhshl00ilhhlltllllil0lilglt00gig000",
				"bonuses": 1,
				"honey": 18,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 8,
						"name": "mushroom"
					}
				],
				"id": "109",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 11,
				"bushes": 3,
				"mask": "0000000000mgm000mgmm000gggmg00gmgg000gmmgm00gmgm000mgggm00mgmg000mgmmg00ggmg0000mgg00000",
				"bonuses": 3,
				"flowers": 5,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 14,
						"name": "mushroom3"
					},
					{
						"count": 17,
						"name": "lavanda"
					}
				],
				"id": "110",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 10,
				"mask": "0000000g00m00mlmmmmm0lfmmmmmllmmmm0llf0mmmgllfmm0gggllmmggllfm0g00g00m00",
				"bonuses": 3,
				"honey": 0,
				"dragonflies": 4
			},
			{
				"items": [
					{
						"count": 27,
						"name": "mushroom3"
					},
					{
						"count": 14,
						"name": "lilly"
					}
				],
				"id": "111",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 8,
				"mask": "g0gg0w0gg0g0wwggglww0ggKlwwKglwwwl0gKwvwKglwwwlg0KwwlKggwwlggg0ww0g0ggw0gg0g0000",
				"bonuses": 3,
				"cankerberries": 12
			},
			{
				"items": [
					{
						"count": 0,
						"name": "lilly"
					},
					{
						"count": 6,
						"name": "goldRoot"
					},
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"interactiveItems":[
					{
						"count": 18,
						"name": "shell"
					}
				],
				"id": "112",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 14,
				"mask": "00www000wwwwwwlwwwwwl0lwwwwllwwwwwl0lpwwpllfpwpfl0lpwwpllwwwwwl0lwwwwllwwwwwl0wwwwww00www0000000",
				"bonuses": 5,
				// "pearls": 18,
				"dragonflies": 2
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 12,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 15,
						"name": "goldRoot"
					}
				],
				"id": "113",
				"environment": 0,
				"leafType": "leaf3",
				"steps": 9,
				"mask": "00000000ww0ww0glwwgg0lglfwwgglwwlg0gwwflglglwwlg0lglfwwgglwwgg00ww0ww000",
				"bonuses": 3,
				"dragonflies": 3
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 24,
						"name": "goldRoot"
					}
				],
				"id": "114",
				"environment": 0,
				"leafType": "leaf4",
				"steps": 14,
				"mask": "gg00ll0gg0l0lll0ll0l0gllljiRlhiihi0Rpgijgllhiihl0lgjigpRihiihl0Rijlllgl0ll0l0ll0l0ggll00gg000000",
				"bonuses": 5,
				"honey": 22,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 3,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "mushroom4"
					},
					{
						"count": 9,
						"name": "mushroom5"
					}
				],
				"interactiveItems":[
					{
						"count": 5,
						"name": "shell"
					}
				],
				"id": "115",
				"header": null,
				"environment": 4,
				"leafType": "leaf1",
				"steps": 7,
				"bushes": 3,
				"mask": "00000000000000000000000gggg00g222g00g2w2g0g2ww2g00g2ww2g0g2w2g00g222g00gggg00000",
				"bonuses": 2,
				// "pearls": 5,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 12,
						"name": "amber"
					}
				],
				"id": "116",
				"header": null,
				"environment": 4,
				"leafType": "leaf1",
				"steps": 12,
				"mask": "0022220002222202222220022222002222000222220222222002222200222200",
				"bonuses": 3,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 6,
						"name": "amber"
					},
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 7,
						"name": "mushroom4"
					},
					{
						"count": 0,
						"name": "mushroom5"
					}
				],
				"id": "117",
				"header": null,
				"environment": 4,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 2,
				"mask": "gg00gg0g2ggg2gg2222g0g2g2g2gg2222g00g2g2g002gg20000g2g00",
				"bonuses": 3,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "lilly"
					},
					{
						"count": 8,
						"name": "amber"
					}
				],
				"interactiveItems":[
					{
						"count": 9,
						"name": "shell"
					}
				],
				"id": "118",
				"header": null,
				"environment": 4,
				"leafType": "leaf1",
				"steps": 7,
				"bushes": 2,
				"mask": "022w220022ww2222www2202wwww222www22022ww22022w22",
				"bonuses": 4,
				// "pearls": 9,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 12,
						"name": "witchMushroom"
					},
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 12,
						"name": "mushroom5"
					}
				],
				"id": "119",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 10,
				"bushes": 3,
				"mask": "Kc00cK0cgc0cgcKgccgK0cggcggcKgccgK0cgc0cgcKc00cK",
				"bonuses": 2,
				"cankerberries": 16
			},
			{
				"items": [
					{
						"count": 8,
						"name": "mushroom3"
					},
					{
						"count": 9,
						"name": "lilly"
					}
				],
				"interactiveItems":[
					{
						"count": 9,
						"name": "shell"
					}
				],
				"id": "120",
				"header": null,
				"environment": 1,
				"leafType": "leaf1",
				"steps": 11,
				"mask": "w0cc0w0wCcwcCwwcwwcw0wCcwcCwwcwwcw0wCcwcCwwcwwcw0wCcwcCww0cc0w00",
				"bonuses": 4,
				// "pearls": 9,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 15,
						"name": "t27"
					},
					{
						"count": 0,
						"name": "mushroom"
					}
				],
				"id": "121",
				"header": null,
				"environment": 1,
				"leafType": "leaf3",
				"steps": 16,
				"mask": "g0gg0g0gcgcgcgcgccgc0gcgcgcggccccg000gcg00cgccgc0gccgccggcggcg0gcgcgcgg0gg0g0000",
				"bonuses": 4,
				"jellyMushrooms": 0
			},
			{
				"items": [
					{
						"count": 37,
						"name": "mushroom"
					}
				],
				"id": "122",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 16,
				"mask": "00000000lg00glgla0alg0iiaaiiglfaflg0iiaaiiglfaflg0iiaaiiglfaflg0iiaaiigla0alg0lg00gl0000",
				"bonuses": 5,
				"acorns": 15,
				"dragonflies": 6
			},
			{
				"items": [
					{
						"name": "mushroom",
						"count": 7
					}
				],
				"id": "123",
				"header": null,
				"environment": 1,
				"leafType": "leaf1",
				"steps": 10,
				"mask": "0000000000000000www0000wjjw00wjajw000wjjw000www000w0ww0wiww0wwi0ii00ii00",
				"bonuses": 3,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 11,
						"name": "amanita"
					},
					{
						"count": 10,
						"name": "lilly"
					}
				],
				"id": "124",
				"header": null,
				"environment": 1,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 3,
				"mask": "CC00CC0ccCwCccccwwcc0cccwcccccwwcc0ccCwCccCC00CC",
				"bonuses": 3,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 28,
						"name": "mushroom"
					}
				],
				"id": "125",
				"header": null,
				"environment": 1,
				"leafType": "leaf3",
				"steps": 10,
				"mask": "cccc0c0cccp0ccpclQcg0glliztlgpiipg0ltzillggcQlcp0cc0pcccc0cccc00",
				"bonuses": 3,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 24,
						"name": "witchMushroom"
					}
				],
				"id": "126",
				"header": null,
				"environment": 1,
				"leafType": "leaf4",
				"steps": 13,
				"mask": "lg000g0gpglgpgglKKlg0llKkKllgppppg0llKkKllglKKlg0gpglgpgg000gl00",
				"bonuses": 4,
				"cankerberries": 18,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 5,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 7,
						"name": "witchMushroom"
					}
				],
				"id": "127",
				"header": null,
				"environment": 1,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 2,
				"mask": "wwggww00wwgww0wwggww0wwgggwwwggggw00wgggw00wwww0",
				"bonuses": 2,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 19,
						"name": "mushroom3"
					}
				],
				"id": "128",
				"header": null,
				"environment": 1,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 3,
				"mask": "0ll0ll0llpiiglgjffjg0lifhfilgjffjg0lgiipllll0ll0",
				"bonuses": 4,
				"honey": 6,
				"dragonflies": 6
			},
			{
				"items": [
					{
						"count": 19,
						"name": "mushroom3"
					}
				],
				"interactiveItems":[
					{
						"count": 11,
						"name": "shell"
					}
				],
				"id": "129",
				"header": null,
				"environment": 1,
				"leafType": "leaf1",
				"steps": 8,
				"mask": "0kl0ww000lipw0gkp0www0ipwwwwgkp0www0iiipwwgkp0www00pwww00kl0ww00",
				"bonuses": 3,
				"cankerberries": 10,
				// "pearls": 11,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 10,
						"name": "mushroom"
					},
					{
						"count": 11,
						"name": "witchMushroom"
					}
				],
				"id": "130",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 6,
				"bushes": 2,
				"mask": "ll00ll0lglllglgggggg0gagagaggaaaag0jjaaajjYj00jQ",
				"ladybugs": [],
				"acorns": 10,
				"bonuses": 0,
				hardLevel: true
			},
			{
				"items": [
					{
						"count": 5,
						"name": "lilly"
					},
					{
						"count": 10,
						"name": "amanita"
					},
					{
						"count": 15,
						"name": "goldRoot"
					}
				],
				"id": "131",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 12,
				"hardLevel":true,
				"mask": "ljw0jl0gljwjlglizwil0gljwjlgliwzil0gljwjlglizwil0gljwjlgliwzil0gljwjlglizwil0gljwjlgljw0jl000000",
				"bonuses": 6,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "amanita"
					},
					{
						"count": 14,
						"name": "goldRoot"
					}
				],
				"id": "132",
				"header": null,
				"environment": 0,
				"leafType": "leaf1",
				"steps": 11,
				"bushes": 2,
				"mask": "gl0lgl0lllPlllllllll0lzflfzlllllll0lllPllllgl0lg",
				"bonuses": 4,
				"dragonflies": 2
			},
			{
				"items": [
					{
						"count": 7,
						"name": "lavanda"
					},
					{
						"count": 7,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "mushroom5"
					},
					{
						"count": 14,
						"name": "goldRoot"
					}
				],
				"id": "133",
				"header": "mountinesHeader",
				"environment": 0,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "0000000000mgg000mggw000mggw00mggw0000mggw000mggw0000mggw00mggw000mggw000mggw0000mggw000mggw000mggw00mggw0000ggw0",
				"bonuses": 3,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 9,
						"name": "strawberry"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 8,
						"name": "blackberry"
					}
				],
				"id": "134",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 3,
				"mask": "01101100111111111111101111110111110001111000111000001100",
				"bonuses": 3,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 6,
						"name": "strawberry"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 7,
						"name": "mushroom4"
					}
				],
				"id": "135",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 7,
				"bushes": 2,
				"mask": "0ggg0000g11gg0g1111g0g11111gg1111g00gg11g000ggg0",
				"bonuses": 3,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 10,
						"name": "mushroom"
					},
					{
						"count": 7,
						"name": "lilly"
					}
				],
				"interactiveItems":[
					{
						"count": 3,
						"name": "shell"
					}
				],
				"id": "136",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 10,
				"mask": "ll00ww0lll0wwwlllwww0lll0wwwlllwww0lll0wwwll00ww",
				"bonuses": 2,
				// "pearls": 3,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 8,
						"name": "blackberry"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 7,
						"name": "mushroom4"
					}
				],
				"id": "137",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 7,
				"bushes": 3,
				"mask": "0g1g11001111g11g1g11g011ggg1g1g11110111g1g0gg11g",
				"bonuses": 3,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 9,
						"name": "lilly"
					}
				],
				"interactiveItems":[
					{
						"count": 9,
						"name": "shell"
					}
				],
				"id": "138",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 2,
				"mask": "Cb00CCC0CwwwbCCwwwwwC0CwbbwCCwwwwwC0CbwwwCCCC00bC0000000",
				"bonuses": 3,
				// "pearls": 9,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 10,
						"name": "amanita"
					}
				],
				"interactiveItems":[
					{
						"count": 16,
						"name": "shell"
					}
				],
				"id": "139",
				"header": null,
				"environment": 3,
				"leafType": "leaf4",
				"steps": 12,
				"mask": "wwll0w0C0ll0bwwwll0w0lwbwlwClwwwwl0lwCCClllC00Cl0llCCCwllwwwwl0Cwlwbwlw0llww0wb0ll0Cw0llww000000",
				"bonuses": 6,
				// "pearls": 16,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 4,
						"name": "blackberry"
					}
				],
				"id": "140",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 3,
				"mask": "0000gg00000g0000gggg000111110111111001111100111100001110",
				"bonuses": 0,
				// "moonflowers": 3,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 12,
						"name": "lilly"
					}
				],
				"id": "141",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 9,
				"mask": "ww0l0g0ww0wl0gwwwlgg0iwwzPggipwwpi0ggPzwwigglwww0g0lw0wwg0l0ww00",
				"bonuses": 2,
				// "moonflowers": 5,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "strawberry"
					},
					{
						"count": 9,
						"name": "blackberry"
					}
				],
				"interactiveItems":[
					{
						"count": 11,
						"name": "shell"
					}
				],
				"id": "142",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 12,
				"bushes": 3,
				"mask": "011110001www101wwww101wwwww11wwww1001www1001ww10001www101wwww1001www100111100000",
				"bonuses": 4,
				// "pearls": 11,
				"ladybugs": [],
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "mushroom5"
					},
					{
						"count": 6,
						"name": "mushroom3"
					},
					{
						"count": 12,
						"name": "strawberry"
					}
				],
				"id": "143",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 10,
				"bushes": 3,
				"mask": "11g011g11g011g11g011g11g011g11g011g11g011g11g011g0000000",
				"bonuses": 2,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 18,
						"name": "amanita"
					},
					{
						"count": 17,
						"name": "lilly"
					}
				],
				"id": "144",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 13,
				"mask": "www0ww0ww00wwwwwwwww0iwpwpwijjjjjj0gigigigcccccc0gigigigjjjjjj0iwpwpwiwwwwww0www00wwww0www000000",
				"bonuses": 5,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 9,
						"name": "strawberry"
					},
					{
						"count": 10,
						"name": "blackberry"
					},
					{
						"count": 11,
						"name": "lavanda"
					}
				],
				"id": "145",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 12,
				"mask": "01mm000011mm00111mm001111mm0111mm00011mm0001mm00000mm0000mm10000mm1100mm11100mm11110mm111000mm11000mm100",
				"bonuses": 3,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 2,
						"name": "strawberry"
					},
					{
						"count": 0,
						"name": "mushroom"
					},
					{
						"count": 0,
						"name": "mushroom4"
					},
					{
						"count": 0,
						"name": "lilly"
					},
					{
						"count": 7,
						"name": "lavanda"
					}
				],
				"interactiveItems":[
					{
						"count": 6,
						"name": "shell"
					}
				],
				"id": "146",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 10,
				"mask": "00mmm000mmmwmmmwmmwm00w1mwmmmwm1mwm0mmwm1w0mwmmwm0mmwmmm00mmm000",
				"bonuses": 3,
				// "pearls": 6,
				"dragonflies": 0,
				"waterCenter": null
			},
			{
				"items": [
					{
						"count": 14,
						"name": "mushroom3"
					},
					{
						"count": 16,
						"name": "lilly"
					}
				],
				"id": "147",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 12,
				"mask": "g0jw0w0giKjwwwgiijww0giijwwwiKjwww0giijwwwggtjww0tggjwwwiKjwww0giijwwwgiijww0giKjwwwg0jw0w000000",
				"bonuses": 5,
				"cankerberries": 8,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 14,
						"name": "mushroom"
					},
					{
						"count": 14,
						"name": "lilly"
					}
				],
				"id": "148",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 8,
				"mask": "QlC0ClY0l0ww0lglwpwlg0wCppCwCwpwpwC0wCppCwglwpwlg0l0ww0lYlC0ClQ0",
				"bonuses": 4,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 16,
						"name": "mushroom3"
					}
				],
				"interactiveItems":[
					{
						"count": 10,
						"name": "shell"
					}
				],
				"id": "149",
				"header": null,
				"environment": 3,
				"leafType": "leaf3",
				"steps": 15,
				"mask": "w0ll0w0wlllllwww00ww0lhwlwhlllwwll0lww0wwlwwllww0whlwlhwwwllww0lww0wwlllwwll0lhwlwhlww00ww0wllwllww0ll0w",
				"bonuses": 5,
				// "pearls": 10,
				"honey": 20,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 12,
						"name": "lavanda"
					}
				],
				"id": "150",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 7,
				"mask": "m0mA0m0mA0A0AmmAAAAm0mEADAEmAA00AA0mEADAEmmAAAAm0mA0A0Amm0Am0m00",
				"bonuses": 4,
				// "books": 6,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 13,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "mushroom3"
					},
					{
						"count": 33,
						"name": "goldRoot"
					}
				],
				"id": "151",
				"header": null,
				"environment": 3,
				"leafType": "leaf3",
				"steps": 17,
				"mask": "ll00ll0gfiwifggiCCig0gpCwCpggiCCig0ifiwifilpCCpl0lQCwCYlljCCjl0ifpwpfiliCCjl0gpCwCpggiCCig0gfEwEfgll00ll",
				"bonuses": 6,
				"dragonflies": 8
			},
			{
				"items": [
					{
						"count": 10,
						"name": "lilly"
					},
					{
						"count": 0,
						"name": "witchMushroom"
					},
					{
						"count": 10,
						"name": "goldRoot"
					}
				],
				"id": "152",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 9,
				"bushes": 3,
				"mask": "0l0bwb0lQlwCwlllwCwl0llbCblllwCwll0lwCwlQlbwb0l0",
				"bonuses": 3,
				"dragonflies": 0
			},
			{
				"items": [
					{
						"count": 10,
						"name": "mushroom3"
					},
					{
						"count": 0,
						"name": "witchMushroom"
					},
					{
						"count": 11,
						"name": "goldRoot"
					}
				],
				"id": "153",
				"header": null,
				"environment": 3,
				"leafType": "leaf1",
				"steps": 8,
				"bushes": 2,
				"mask": "000l0l0000gkkg00lgggl000kllg00ll0ll000gllk00lggtl000gllk00ll0ll000kllg00ltggl000kllg00ll0ll000gllk00lgggl000gkkg000l0l00",
				"bonuses": 5,
				"cankerberries": 10
			},
			// {
			// 	"items": [
			// 		{
			// 			"count": 15,
			// 			"name": "mushroom3"
			// 		},
			// 		{
			// 			"count": 15,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "154",
			// 	"header": null,
			// 	"environment": 3,
			// 	"leafType": "leaf1",
			// 	"steps": 9,
			// 	"mask": "mm00mm0mmmmmmmmmggmm0gmglgmgggllgg0ggl0lgggl00lg0ggl0lggggllgg0gmglgmgmmggmm0mmmmmmmmm00mm000000",
			// 	"bonuses": 7,
			// 	"blueberries": 20
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 14,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 14,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "155",
			// 	"header": null,
			// 	"environment": 3,
			// 	"leafType": "leaf1",
			// 	"steps": 8,
			// 	"mask": "m0mm0m0mmmmmmmmmmmmm0wmwmwmwwwwwww0wwwwwwwwwwwww00w0w0w0",
			// 	"bonuses": 1
			// },
			// {
			// 	"items": [
			// 		{
			// 			"name": "mushroom",
			// 			"count": 7
			// 		}
			// 	],
			// 	"id": "158",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "0000000000000000000000ggggggmgggggm0mggggmwmgggmw0wmggmw0wmgmw000wmmw000wbw00000",
			// 	"bonuses": 3,
			// 	"dragonflies": 0,
			// 	"waterCenter": null
			// },
			// {
			// 	"items": [
			// 		{
			// 			"name": "mushroom",
			// 			"count": 7
			// 		}
			// 	],
			// 	"id": "159",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "ggBBB00gwgBBB0gwg00000gwg0000gwg00000gwg0000gwg00BBBgwg0BBBggg00",
			// 	"bonuses": 3,
			// 	"waterCenter": null
			// },
			// {
			// 	"items": [
			// 		{
			// 			"name": "mushroom",
			// 			"count": 7
			// 		}
			// 	],
			// 	"id": "162",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 10,
			// 	"bushes": 3,
			// 	"mask": "00gag000ggggaggaggggg0gggagggagggga00gjl00000jl00000jl00000il000",
			// 	"bonuses": 3,
			// 	"ladybugs": [],
			// 	"waterCenter": null
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 17,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "163",
			// 	"header": null,
			// 	"environment": 3,
			// 	"leafType": "leaf1",
			// 	"steps": 7,
			// 	"mask": "ww0wwb0wwwwwwwwDCDwA0ABDCDBAADCCDA0ABDCDBAAwDCDw0wwwwwwwbww0ww00",
			// 	"bonuses": 5,
			// 	"books": 5,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 14,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 14,
			// 			"name": "mushroom5"
			// 		},
			// 		{
			// 			"count": 14,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "165",
			// 	"header": null,
			// 	"environment": 1,
			// 	"leafType": "leaf3",
			// 	"steps": 15,
			// 	"mask": "g00g00g0ggggggcjgjgjc0ggjjggcjgjgjc0ggggggcjpjpjc0gcgccgcjcjgjc0gcjjcccjgjcjg0gcccgcc00g00g00000",
			// 	"bonuses": 4,
			// 	"moonflowers": 0,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 9,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 8,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "167",
			// 	"header": null,
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "w0ll0w0lwwlwwlliwwil0wwjwjwwlwwwwl0liwjwilwwjjww0wwwwwwww0ww0w00",
			// 	"bonuses": 3,
			// 	"pearls": 6,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 5,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 7,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "169",
			// 	"header": null,
			// 	"environment": 3,
			// 	"leafType": "leaf1",
			// 	"steps": 13,
			// 	"mask": "mjlljm0mmljlmmjj00jj0mmmtmmmjj00jj0mmljlmmmjlljm",
			// 	"bonuses": 4
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 3,
			// 			"name": "strawberry"
			// 		},
			// 		{
			// 			"count": 0,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 6,
			// 			"name": "mushroom4"
			// 		}
			// 	],
			// 	"id": "170",
			// 	"header": null,
			// 	"environment": 3,
			// 	"leafType": "leaf1",
			// 	"steps": 8,
			// 	"bushes": 3,
			// 	"mask": "0ggg1000111g101gg1g101g1g1g11g11g1001ggg10011110",
			// 	"bonuses": 0,
			// 	"moonflowers": 3,
			// 	"dragonflies": 0,
			// 	"waterCenter": null
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 12,
			// 			"name": "mushroom5"
			// 		},
			// 		{
			// 			"count": 22,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 0,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "171",
			// 	"header": null,
			// 	"environment": 3,
			// 	"leafType": "leaf3",
			// 	"steps": 15,
			// 	"mask": "mBl00m0mABgpBmmBggBm0mBpgBAmmBglBm0mABgpBmmBggBm0mBpgBAmmBlgBm0mABgpBmmBggBm0mBpgBAmm00lBm000000",
			// 	"bonuses": 3,
			// 	"moonflowers": 5,
			// 	"books": 0,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 24,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "172",
			// 	"header": null,
			// 	"environment": 3,
			// 	"leafType": "leaf1",
			// 	"steps": 12,
			// 	"mask": "l0ll0l00llgll0gcggcg00lcccl0gllllg00gcgcg0ggccgg00llgll0gcllcg00gcccg0gllllg00lclcl0g0cc0g000000",
			// 	"bonuses": 5,
			// 	"moonflowers": 4,
			// 	"ladybugs": [
			// 		1,
			// 		-4,
			// 		4
			// 	],
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 18,
			// 			"name": "mushroom3"
			// 		},
			// 		{
			// 			"count": 12,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "173",
			// 	"header": null,
			// 	"environment": 3,
			// 	"leafType": "leaf3",
			// 	"steps": 8,
			// 	"mask": "0000000m00m00mm0mm0m0mmmmmmmmgmmgm0lggmgglljlljl0flflflfl0ll0l0l00l00l00",
			// 	"bonuses": 3,
			// 	"dragonflies": 4
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 11,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 7,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "174",
			// 	"header": null,
			// 	"environment": 3,
			// 	"leafType": "leaf1",
			// 	"steps": 9,
			// 	"mask": "g0mm0g0gglmlggglmmlg00lmmml0glmmlg0glmmmlgg0mm0g",
			// 	"bonuses": 6
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 10,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 20,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t_0",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 11,
			// 	"mask": "w0CBB0m0wwwmmmCwC0BmB0wwwmmmYwC0BmQ0wwwmmmCwC0BmB0wwwmmmQwC0BmY0wwwmmmCwC0BmB0wwwmmmw0CCB0m00000",
			// 	"bonuses": 4,
			// 	"books": 5,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 8,
			// 			"name": "witchMushroom"
			// 		},
			// 		{
			// 			"count": 14,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 0,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t_1",
			// 	"header": "mountinesHeader",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 9,
			// 	"mask": "A0mA0A0AmmAmmAAmAmmA0AAmAmAAApAApA0jjjjjjjlgllgl0g0ggg0g",
			// 	"bonuses": 5,
			// 	"flowers": 4,
			// 	"books": 0,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [],
			// 	"id": "t_2",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 8,
			// 	"mask": "0000000gggg00gg00t0g0alalalallllll0lflflflllllll0alalalag0t00g0g00gggg00",
			// 	"bonuses": 4,
			// 	"blueberries": 34,
			// 	"acorns": 8,
			// 	"dragonflies": 3
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 7,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 7,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t_3",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 17,
			// 	"mask": "m0kk0m0m0klk0mm0gg0m0m0ggg0mm0gg0m0m0tgg0mm0ll0m0m0lkl0mm0kk0m0m0lkl0mm0ll0m0m0ggt0mm0gg0m0m0ggg0mm0gg0m0m0klk0mm0kk0m00",
			// 	"bonuses": 4,
			// 	"cankerberries": 12
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 6,
			// 			"name": "mushroom3"
			// 		},
			// 		{
			// 			"count": 6,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "t_4",
			// 	"header": "mountinesHeader",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"bushes": 2,
			// 	"mask": "mmmmmm0mmmmmmmmmmmmm00ggggg00llll0000jjj000gjjg0",
			// 	"bonuses": 3
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 16,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 16,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t_5",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 8,
			// 	"mask": "ll00ll0lllgltlllggll000lll00glaalg0glaaalgglaalg000lll00llggll0ltlglllll00ll0000",
			// 	"bonuses": 4,
			// 	"acorns": 7
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 20,
			// 			"name": "mushroom"
			// 		}
			// 	],
			// 	"id": "t_6",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 7,
			// 	"mask": "l0000l0lgigigliiiiii0ilgjglitlgglt0iljjjligliilg0gi000ig",
			// 	"bonuses": 3,
			// 	"ladybugs": [
			// 		2,
			// 		3
			// 	]
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 0,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 6,
			// 			"name": "amanita"
			// 		}
			// 	],
			// 	"id": "t19",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 16,
			// 	"mask": "lg00gl0gl0g0lggl00lg0lggjgglggjjgg0gjjjjjgggjjgg0lggjgglgl00lg0gl0g0lglg00gl0000",
			// 	"bonuses": 5,
			// 	"blueberries": 24,
			// 	"flowers": 4
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 20,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 8,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "t27",
			// 	"header": "mountinesHeader",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 13,
			// 	"mask": "ala00g0llll0galgglgi0gggmgiim0mmgm0gmmmmmgmgmm0m0iigm0ggiglggl0ag0lllgl00ala0mggllm0mm00mm00mm00m0000000",
			// 	"bonuses": 5,
			// 	"acorns": 6
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 27,
			// 			"name": "mushroom"
			// 		}
			// 	],
			// 	"id": "t28",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 13,
			// 	"mask": "g0gg0g0ggggggggcggcg0gggggggg0gg0g0sgcacggg0gg0g0ggggggggcggcg0gggggggg0gg0g0ggcacgsg0gg0g0ggggggggcggcg0gggggggg0gg0g00",
			// 	"bonuses": 6,
			// 	"ladybugs": [
			// 		-6,
			// 		-2
			// 	],
			// 	"acorns": 2
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 9,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t29",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 11,
			// 	"mask": "l0gg0l0lg0g0gllg00gl0lgjKjgllgjjgl0lgjKjgllajjal00l0k0l0",
			// 	"bonuses": 4,
			// 	"cankerberries": 5,
			// 	"acorns": 2
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 25,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t30",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 15,
			// 	"mask": "cc00cc0aggcggscggggc0gggcgggcg00gc0gggcggacggggc0aggcgggcg00gc0gggcgggcggggc0sggcggacc00cc000000",
			// 	"bonuses": 6,
			// 	"flowers": 5,
			// 	"acorns": 4
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 15,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 15,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t35",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 9,
			// 	"mask": "gg00gg0gglllgggl00lg0gl000lggllllg0ggKtKgggllllg0gl000lggl00lg0gglllgggl00lg0gl000lggllllg0ggKtKgggllllg0gl000lg",
			// 	"bonuses": 8,
			// 	"cankerberries": 8
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 15,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 20,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t39",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 7,
			// 	"mask": "00ll00000lgl00llKgww0lgKgwwwlKgwww0lggwww0ltwww0000www0000ww00000www000wwwtl00wwwgglwwwgKl0wwwgKglwwgKll000lgl0000ll0000",
			// 	"bonuses": 4,
			// 	"cankerberries": 12
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 17,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 17,
			// 			"name": "mushroom3"
			// 		}
			// 	],
			// 	"id": "t43",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 8,
			// 	"mask": "0ll0ll0llllllllliiil0ligggvliggggi0lvgggilliiill0lllllllll0ll000",
			// 	"bonuses": 3
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 12,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 14,
			// 			"name": "mushroom3"
			// 		}
			// 	],
			// 	"id": "t47",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 10,
			// 	"mask": "0gggg00g0ggg0gglgglg0gglglggggiigg0lliyillggiigg00llvll0l0ll0l0000l00000",
			// 	"bonuses": 3,
			// 	"ladybugs": [
			// 		8,
			// 		12
			// 	]
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 25,
			// 			"name": "mushroom"
			// 		}
			// 	],
			// 	"id": "t51",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 6,
			// 	"mask": "l000lj0jjlljjlljljjg0gljjllgglQYlg0ggljjgggjjljl0ljjlljjjl000l00",
			// 	"bonuses": 2,
			// 	"flowers": 5
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 10,
			// 			"name": "mushroom3"
			// 		},
			// 		{
			// 			"count": 25,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t53",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "gw00wg0gwwgwwggwwwwg0gwwvwwggwwwwg0gwwgwwggwwwwg0gwwswwggwwwwg0gwwgwwggwwwwg0gwwvwwggwwwwg0gwwgwwggw00wg",
			// 	"bonuses": 3,
			// 	"ladybugs": [
			// 		2,
			// 		3
			// 	]
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 15,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 16,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t56",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 6,
			// 	"mask": "0gg0gg0g0gg0gglggggl0laajaallajjal0laajaallggggl0gg0gg0ggg0gg000",
			// 	"bonuses": 3,
			// 	"acorns": 10
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 11,
			// 			"name": "mushroom3"
			// 		},
			// 		{
			// 			"count": 21,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 14,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t57",
			// 	"header": null,
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 8,
			// 	"mask": "gg0mmm0ggg0mmmgl0mmm0ggl0mmmlljjmm0mljtjmmmjjjjm0mmjtjlmmmjjll0mmm0lggmmm0lg0mmm0gggmmm0gg000000",
			// 	"bonuses": 3
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 31,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t61",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 8,
			// 	"mask": "k000ll0ll00gKlkjlggg0jjkllglllllll0lgllkjjgggljk0lKg00llll000k00",
			// 	"bonuses": 2,
			// 	"cankerberries": 10
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 24,
			// 			"name": "mushroom"
			// 		}
			// 	],
			// 	"id": "t64",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 8,
			// 	"mask": "jl00lj0Qjl0ljYjgl0gj0jglllgjljlljl0lglllglll0lll0ljl0ljlll00ll00",
			// 	"bonuses": 2,
			// 	"blueberries": 20,
			// 	"ladybugs": []
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 21,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 21,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t68",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 15,
			// 	"mask": "llg00l0lllggll00lllK0llgglllKllv000lllggll00lllK0llgglllKllll00lllggll00vllK0llgglllKlll000llggllll00gll",
			// 	"bonuses": 2,
			// 	"cankerberries": 12
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 16,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 16,
			// 			"name": "mushroom3"
			// 		}
			// 	],
			// 	"id": "t70",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 9,
			// 	"mask": "ll0lll0lgjfjglgll0lg0lgjfjglll0llg0lgjfjglgll0lg0lgjfjglll0lll00",
			// 	"bonuses": 4,
			// 	"dragonflies": 4
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 25,
			// 			"name": "mushroom3"
			// 		}
			// 	],
			// 	"id": "t71",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 12,
			// 	"mask": "gl0glg0lgj0jglgjffjg0lgjjjglKgKKgK0lgjjjglgjffjg0lgj0jglglg0lg00",
			// 	"bonuses": 4,
			// 	"cankerberries": 8,
			// 	"dragonflies": 4
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 25,
			// 			"name": "mushroom"
			// 		}
			// 	],
			// 	"id": "t72",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 11,
			// 	"mask": "0gllg00l0glg0lggKKgg0gllfllggKffKg0lglflglglKKlg0l0glg0l0lggl000",
			// 	"bonuses": 4,
			// 	"cankerberries": 12,
			// 	"dragonflies": 4
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 18,
			// 			"name": "mushroom3"
			// 		},
			// 		{
			// 			"count": 14,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t77",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 8,
			// 	"mask": "00000000lg0gl00gjgg00lgflfggggjgjg0gfgVgfggjgjgg0lgflfgl0ggjg000lg0gl000",
			// 	"bonuses": 3,
			// 	"dragonflies": 6
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 14,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 14,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t80",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 3,
			// 	"mask": "llllll0l0lll0lwlwwlw0wwwVwwwwwwwww0wwwVwwwwlwwlw0l0lll0lllllll00",
			// 	"bonuses": 3,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 13,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 13,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t81",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 7,
			// 	"mask": "w00llw0wwllilwwwljlw0wwliflwwwljlw0wwlfilwwwljlw0wwlillww00llw00",
			// 	"bonuses": 3,
			// 	"dragonflies": 2
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 25,
			// 			"name": "mushroom3"
			// 		}
			// 	],
			// 	"id": "t87",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "l0gg0l0lgiflglg0li0l0llijilgglKKlg0glijilll0il0g0lglfigll0gg0l00",
			// 	"bonuses": 4,
			// 	"cankerberries": 4,
			// 	"dragonflies": 2
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 23,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t90",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "0000000gg000ggiiggii0ihglghiggllgg0ggKlKggglKKlg0lglllgllg00gl00",
			// 	"bonuses": 4,
			// 	"cankerberries": 8,
			// 	"honey": 12,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [],
			// 	"id": "t91",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 10,
			// 	"mask": "lll0ll0lggllhllgg0il0lglgiglliigil0lififilligiil0lgiglglli0ggl0lhllgglll0lll0000",
			// 	"bonuses": 7,
			// 	"blueberries": 50,
			// 	"honey": 12,
			// 	"dragonflies": 2
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 18,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t93",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "lg0lll0ggg0lVlgjiill0gjihijglliijg0lVl0ggglll0gl",
			// 	"bonuses": 3,
			// 	"flowers": 3,
			// 	"honey": 6,
			// 	"dragonflies": 0,
			// 	"cellsToSpawn": 10
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 16,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t95",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 10,
			// 	"mask": "g0gg0g0gg0l0gglgllgl0giifiigihiihi0giifiiglgllgl0gg0l0ggg0gg0g00",
			// 	"bonuses": 4,
			// 	"honey": 12,
			// 	"dragonflies": 2
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 10,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 7,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t97",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "g0000g0glglglgiiiiii0wwwjwww0wjjw00wjwjwjwwwwwww0wwwwwwww0000w00",
			// 	"bonuses": 4,
			// 	"pearls": 4,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 18,
			// 			"name": "amanita"
			// 		}
			// 	],
			// 	"id": "t101",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 14,
			// 	"mask": "g0gggg0gggl00glgipgl0gpplpjgphjjhp0gjplppglgpigl0g00lggggggg0g00",
			// 	"bonuses": 5,
			// 	"honey": 10,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 19,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"separators": [
			// 		{
			// 			"X": 1,
			// 			"Y": 0,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 1,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 0,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 1,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 2,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 3,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 2,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 3,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 5,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 4,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 4,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 5,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 1,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 2,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 1,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 2,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 2,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 2,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 2,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 2,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 4,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 4,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 3,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 4,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 3,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 3,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 3,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 2,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 2,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 2,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 2,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 1,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 4,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 4,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 3,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 4,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 3,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 3,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 2,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 3,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 2,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 2,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 1,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 2,
			// 			"type": 0
			// 		}
			// 	],
			// 	"id": "t103",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 12,
			// 	"mask": "g0g0g0g0llggllglggglg0iziiziglQiYlg0gljjlggggtggg0g0gg0g",
			// 	"bonuses": 5,
			// 	"ladybugs": [
			// 		1,
			// 		3,
			// 		5
			// 	],
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 21,
			// 			"name": "mushroom"
			// 		}
			// 	],
			// 	"separators": [],
			// 	"id": "t105",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 6,
			// 	"mask": "gg00gg0glggglglliill0gipjpiglphhpg0lijpjiljliilj0YjglgjQjg00gj00",
			// 	"bonuses": 4,
			// 	"honey": 8,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 18,
			// 			"name": "mushroom3"
			// 		}
			// 	],
			// 	"id": "t106",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 11,
			// 	"mask": "ggg0gg0gl00igggillig0glalalggpaapg0glppplggillig0ggi00lggg0ggg00",
			// 	"bonuses": 5,
			// 	"acorns": 4,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 21,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t108",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 12,
			// 	"mask": "g0ggg0g0g0ll0ggllKklg0ggKhkgglpKplg0gkhKggglkKllg0g0ll0gg0ggg0g0",
			// 	"bonuses": 5,
			// 	"cankerberries": 14,
			// 	"honey": 10,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 21,
			// 			"name": "mushroom3"
			// 		}
			// 	],
			// 	"separators": [
			// 		{
			// 			"X": 3,
			// 			"Y": 5,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 6,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 5,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 6,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 5,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 6,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 5,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 6,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 5,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 5,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 5,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 5,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 4,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 5,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 4,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 5,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 4,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 4,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 4,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 4,
			// 			"type": 4
			// 		}
			// 	],
			// 	"id": "t109",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 10,
			// 	"mask": "0g000g00glgglgggijigg0ljaajlglafalg0lgaaglglllllg0llllll0g000g00",
			// 	"bonuses": 4,
			// 	"acorns": 6,
			// 	"dragonflies": 1
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 16,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 9,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t111",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "mw00wm0mmwwwmmmmwwmm0mmmwmmmmwwwwm0mmmwmmmmmwwmm0mwwmwwmm0mm0m00",
			// 	"bonuses": 3,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 0,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "t_115",
			// 	"header": "mountinesHeader",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 12,
			// 	"bushes": 3,
			// 	"mask": "0AA0AA00AmAAmmmmEAEmm0ABEEBAmmEAEmm0AmAAmA0AA0AA",
			// 	"bonuses": 4,
			// 	"books": 8,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 32,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"separators": [
			// 		{
			// 			"X": 2,
			// 			"Y": 9,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 8,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 10,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 9,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 10,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 9,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 8,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 9,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 5,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 6,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 5,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 6,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 4,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 5,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 5,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 4,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 9,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 10,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 10,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 9,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 5,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 6,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 5,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 6,
			// 			"type": 3
			// 		}
			// 	],
			// 	"id": "t115",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 13,
			// 	"mask": "l0glg0l0l0lg0ll0lll0l0jlaaljggazagg0ljaajlglltllg0ljaajlggazagg0jlaaljl0lll0l0l0gl0ll0glg0l00000",
			// 	"bonuses": 6,
			// 	"acorns": 12,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 15,
			// 			"name": "lilly"
			// 		},
			// 		{
			// 			"count": 8,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "t_116",
			// 	"header": "mountinesHeader",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 6,
			// 	"mask": "ww0mww0wwmmmwwwwm0mw0wwmmmwwwm0mww0wwmmmwwwwm0mw0wwmmmwwww0mww00",
			// 	"bonuses": 1,
			// 	"books": 3
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 0,
			// 			"name": "witchMushroom"
			// 		},
			// 		{
			// 			"count": 10,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 10,
			// 			"name": "mushroom3"
			// 		}
			// 	],
			// 	"id": "t_117",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 20,
			// 	"mask": "gggggg0gcgcgcggggggg0gcgctcgjgjjgj0jcjcjcjjjggjj0gctcgcgjjggjj0jcjcjcjjgjjgj0gcgctcggggggg0gcgcgcggggggg0gctcgcggggggg00",
			// 	"bonuses": 4,
			// 	"ladybugs": [
			// 		-6,
			// 		-2,
			// 		-4
			// 	]
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 20,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t117",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 7,
			// 	"mask": "lllg000glgg0igglptli0glPhPlgiltplg0gi0gglg00glll",
			// 	"bonuses": 3,
			// 	"honey": 6,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 11,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 13,
			// 			"name": "mushroom"
			// 		}
			// 	],
			// 	"id": "t_118",
			// 	"header": "mountinesHeader",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 6,
			// 	"bushes": 3,
			// 	"mask": "mm00mm0mjjmjjmmjmmjm0mjmvmjmmjmmjm0mjjmjjmmm00mm",
			// 	"bonuses": 2,
			// 	"books": 2
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 10,
			// 			"name": "amanita"
			// 		},
			// 		{
			// 			"count": 15,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "t118",
			// 	"header": "mountinesHeader",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 11,
			// 	"mask": "mmm0mmm0mmiimmm0ifi0m0mmjjmmmjjfjjm0mmjjmmm0ifi0m0mmiimmmmm0mmm0",
			// 	"bonuses": 4,
			// 	"dragonflies": 3
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 7,
			// 			"name": "amanita"
			// 		},
			// 		{
			// 			"count": 7,
			// 			"name": "mushroom3"
			// 		},
			// 		{
			// 			"count": 7,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t120",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 9,
			// 	"mask": "gl00lg0lPigiPlglgglg0ligVgilgpggpg0glizilgl0ll0l0gl0l0lg",
			// 	"bonuses": 2,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 15,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t121",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 8,
			// 	"mask": "ww0www0wbCwCbwwwwwww0CCCCCCCwwwwww0wbCwCbwwww0ww",
			// 	"bonuses": 3,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 0,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 17,
			// 			"name": "amanita"
			// 		}
			// 	],
			// 	"id": "t123",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 12,
			// 	"mask": "0gggg00ggggggggggggg0ggggggggggggg0ggggggggggggg0ggggggg0gggg000",
			// 	"bonuses": 1,
			// 	"moonflowers": 4,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 7,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 13,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "t124",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 10,
			// 	"mask": "A0AAAA00BABABAgAgDgAg0ppppppgAgDgAg0ABABAB0AAAA0A0000000",
			// 	"bonuses": 4,
			// 	"books": 1,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 14,
			// 			"name": "lavanda"
			// 		},
			// 		{
			// 			"count": 11,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t127",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "A0A00C0AAAAAACADDACC0ADBBACwABAACC0AAACCwwAAACCw0AACCwwwA00w0w00",
			// 	"bonuses": 4,
			// 	"books": 1,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 15,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t129",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "C0CCC0C0CCw00CwwwbwwC0wbwwbwCwwbwww0C00wCCC0CCC0C0000000",
			// 	"bonuses": 3,
			// 	"pearls": 5,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 22,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "t130",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 8,
			// 	"mask": "Am00AA0mAADBmAmBAAEA0mmFFFmmAEAABm0AmBDAAmAA00mA",
			// 	"bonuses": 4,
			// 	"books": 1,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 11,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t133",
			// 	"header": "mountinesHeader",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 10,
			// 	"mask": "0m0mmm0mmmmmmcmcmcmg0gggmgggccmmcc0gggmggggmcmcm0cmmmmmmmmm0m000",
			// 	"bonuses": 4,
			// 	"books": 6,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 20,
			// 			"name": "mushroom"
			// 		}
			// 	],
			// 	"id": "t139",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 10,
			// 	"mask": "lg0glg0lllllllcjcjci0chhhhhcicjcjc0lllllllglg0gl",
			// 	"bonuses": 3,
			// 	"honey": 14,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 19,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t140",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 10,
			// 	"mask": "cc0lfc00lcllclcllfllc0ccggcccllfllc0lcllcl0cfl0cc0000000",
			// 	"bonuses": 3,
			// 	"dragonflies": 4
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 18,
			// 			"name": "amanita"
			// 		}
			// 	],
			// 	"id": "t142",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 12,
			// 	"mask": "fc00lf0lggplcclpiipc0lgPfPglcpiipl0cclpgglfl00cf",
			// 	"bonuses": 4,
			// 	"dragonflies": 5
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 12,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "t143",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 7,
			// 	"mask": "AmmB0A00AAdBA0mAAAAm00AEAEA0mAAAAm00ABdAA0A0BmmA",
			// 	"bonuses": 3,
			// 	"books": 6,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 21,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"separators": [
			// 		{
			// 			"X": 0,
			// 			"Y": 7,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 7,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 7,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 8,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 7,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 8,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 7,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 7,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 7,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 7,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 7,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 8,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 7,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 8,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 7,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 7,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 1,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 1,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 0,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 1,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 0,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 1,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 1,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 1,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 1,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 1,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 0,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 1,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 1,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 0,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 1,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 1,
			// 			"type": 4
			// 		}
			// 	],
			// 	"id": "t144",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 8,
			// 	"mask": "cc0cc00cgccgc0clhlg00cllllg0ghlhg00gllllc0glhlc00cgccgc0cc0cc000",
			// 	"bonuses": 4,
			// 	"honey": 18,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 9,
			// 			"name": "amanita"
			// 		},
			// 		{
			// 			"count": 8,
			// 			"name": "lavanda"
			// 		}
			// 	],
			// 	"id": "t145",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 10,
			// 	"mask": "c0A0cc0AAgAAcccAAAAc0cgAEAgccAAAAc0ccAAgAAcc0A0g",
			// 	"bonuses": 3,
			// 	"books": 2,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 18,
			// 			"name": "mushroom"
			// 		}
			// 	],
			// 	"separators": [
			// 		{
			// 			"X": 2,
			// 			"Y": 0,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 0,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 0,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 0,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 2,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 3,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 2,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 3,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 3,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 4,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 3,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 4,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 2,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 3,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 2,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 3,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 4,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 5,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 4,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 5,
			// 			"type": 0
			// 		}
			// 	],
			// 	"id": "t147",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "ggl0lgg0ggllgggllpllg0lllllllglllgl0lggggllll0lll0000000",
			// 	"bonuses": 4,
			// 	"ladybugs": [
			// 		3
			// 	],
			// 	"flowers": 4,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 24,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"separators": [
			// 		{
			// 			"X": 1,
			// 			"Y": 4,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 5,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 5,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 5,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 6,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 5,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 5,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 6,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 5,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 5,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 4,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 5,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 4,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 5,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 5,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 5,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 6,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 5,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 5,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 6,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 5,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 5,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 5,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 4,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 4,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 4,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 3,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 4,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 4,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 4,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 3,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 4,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 3,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 3,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 3,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 3,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 2,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 3,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 2,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 3,
			// 			"type": 3
			// 		}
			// 	],
			// 	"id": "t148",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 10,
			// 	"mask": "l0ll0l0lllpllllaiial0lalalallaaaal0gpaiapggpggpg0gggggggg0gg0g00",
			// 	"bonuses": 4,
			// 	"acorns": 11,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 20,
			// 			"name": "amanita"
			// 		}
			// 	],
			// 	"id": "t151",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 11,
			// 	"mask": "l0lg0l0lggjglgKliKgg0gpKPKpgggKilK0glgjggll0gl0l",
			// 	"bonuses": 4,
			// 	"cankerberries": 12,
			// 	"dragonflies": 0,
			// 	"cellsToSpawn": 3
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 24,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t152",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 11,
			// 	"mask": "g0cccc0gkkgkgcggjjgg0gPjRjPgiKppKi0gPjRjPgggjjgg0cgkgkkgcccc0g00",
			// 	"bonuses": 5,
			// 	"cankerberries": 10,
			// 	"dragonflies": 0,
			// 	"cellsToSpawn": 5
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 8,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t154",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "m0lll0m0mimiimmiAAAim0mAFFAmmiAAAim0miimimm0lll0m0000000",
			// 	"bonuses": 4,
			// 	"books": 7,
			// 	"dragonflies": 0,
			// 	"cellsToSpawn": 3
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 20,
			// 			"name": "amanita"
			// 		}
			// 	],
			// 	"separators": [
			// 		{
			// 			"X": 2,
			// 			"Y": 0,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 0,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 0,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 1,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 0,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 0,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 0,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 1,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 2,
			// 			"Y": 2,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 3,
			// 			"Y": 3,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 2,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 4,
			// 			"Y": 3,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 2,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 3,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 2,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 2,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 0,
			// 			"Y": 2,
			// 			"type": 3
			// 		},
			// 		{
			// 			"X": 1,
			// 			"Y": 1,
			// 			"type": 2
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 2,
			// 			"type": 5
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 3,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 5,
			// 			"Y": 2,
			// 			"type": 4
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 2,
			// 			"type": 1
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 2,
			// 			"type": 0
			// 		},
			// 		{
			// 			"X": 6,
			// 			"Y": 1,
			// 			"type": 5
			// 		}
			// 	],
			// 	"id": "t157",
			// 	"environment": 0,
			// 	"leafType": "leaf3",
			// 	"steps": 10,
			// 	"mask": "gg0l0gg0gcllcgggiligg0gjjjjggpcPcpg0llcclll0glg0l0000000",
			// 	"bonuses": 4,
			// 	"ladybugs": [
			// 		2,
			// 		4
			// 	],
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 25,
			// 			"name": "mushroom3"
			// 		}
			// 	],
			// 	"id": "t158",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 11,
			// 	"mask": "l0gg0l0llfifllgliilg0ggfjfgglliill0ggfjfggggiigg0llfiflll0gg0l00",
			// 	"bonuses": 4,
			// 	"dragonflies": 8,
			// 	"cellsToSpawn": 5
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 38,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t159",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 18,
			// 	"mask": "gl0l0l0gillllgggjjgg0gijKjiglgjpgl0gliKilgggpjgg0gjiKijgggjpgg0lijKjilggjjgg0glllligl0l0lg000000",
			// 	"bonuses": 5,
			// 	"cankerberries": 8,
			// 	"dragonflies": 0,
			// 	"cellsToSpawn": 8
			// },
			// {
			// 	"items": [],
			// 	"id": "t161",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 10,
			// 	"mask": "CC0CCC0CwwwwwCQACCAA0AAACAAAADEEDA0AAACAAAAACCAQ0CwwwwwCCCC0CC00",
			// 	"bonuses": 4,
			// 	"pearls": 15,
			// 	"books": 6,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 8,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t163",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 7,
			// 	"mask": "C0000C0wwCwCwbwCCCCw0wCwwwCwwCCCCw0bwCwCwwC0000C",
			// 	"bonuses": 3,
			// 	"pearls": 8,
			// 	"dragonflies": 0
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 25,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t164",
			// 	"environment": 0,
			// 	"leafType": "leaf4",
			// 	"steps": 14,
			// 	"mask": "ll0lll0lal0lfglal0lg0llallfgglaalg0gfllallgl0lal0gfl0lallll0ll00",
			// 	"bonuses": 4,
			// 	"acorns": 8,
			// 	"dragonflies": 4,
			// 	"cellsToSpawn": 6
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 8,
			// 			"name": "mushroom"
			// 		},
			// 		{
			// 			"count": 13,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t166",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 9,
			// 	"mask": "w0wwww0wwwplwwwljjlw0wpjzjpwwljjlw0wwlpwwwwwww0w",
			// 	"bonuses": 4,
			// 	"dragonflies": 0,
			// 	"cellsToSpawn": 4
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 14,
			// 			"name": "witchMushroom"
			// 		}
			// 	],
			// 	"id": "t167",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 13,
			// 	"mask": "gg0g0gg0llg0lllAlAlAl0AAAAAABBBBBBB0AAAAAAlAlAlAl0ll0gllgg0g0gg0",
			// 	"bonuses": 4,
			// 	"books": 6,
			// 	"dragonflies": 0,
			// 	"cellsToSpawn": 8
			// },
			// {
			// 	"items": [
			// 		{
			// 			"count": 10,
			// 			"name": "mushroom3"
			// 		},
			// 		{
			// 			"count": 9,
			// 			"name": "lilly"
			// 		}
			// 	],
			// 	"id": "t169",
			// 	"environment": 0,
			// 	"leafType": "leaf1",
			// 	"steps": 8,
			// 	"mask": "C0C000l0CCClllllCCCgg0glCClgggCCCll0lllCCCl000C0C0000000",
			// 	"bonuses": 3,
			// 	"dragonflies": 0,
			// 	"cellsToSpawn": 3
			// }
];
}


