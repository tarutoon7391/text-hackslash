'use strict';

/* ==============================================================
   レベルアップ・スキルツリーシステム
   ============================================================== */

/** レベル上限 */
const MAX_LEVEL = 500;

/**
 * 各レベルに達するために必要な累計 EXP テーブル（インデックス = レベル - 1）
 */
const EXP_TABLE = [
  0,        // Lv  1
  700,      // Lv  2
  1500,     // Lv  3
  2400,     // Lv  4
  3800,     // Lv  5
  5300,     // Lv  6
  6900,     // Lv  7
  9200,     // Lv  8
  11500,    // Lv  9
  13800,    // Lv 10
  16100,    // Lv 11
  19900,    // Lv 12
  23900,    // Lv 13
  27900,    // Lv 14
  31900,    // Lv 15
  38300,    // Lv 16
  44800,    // Lv 17
  51300,    // Lv 18
  57800,    // Lv 19
  64300,    // Lv 20
  71300,    // Lv 21
  79300,    // Lv 22
  87800,    // Lv 23
  96800,    // Lv 24
  106800,   // Lv 25
  117300,   // Lv 26
  128300,   // Lv 27
  140300,   // Lv 28
  152800,   // Lv 29
  165800,   // Lv 30
  179800,   // Lv 31
  194300,   // Lv 32
  209300,   // Lv 33
  225300,   // Lv 34
  243300,   // Lv 35
  262300,   // Lv 36
  282300,   // Lv 37
  303300,   // Lv 38
  325300,   // Lv 39
  350300,   // Lv 40
  376300,   // Lv 41
  403300,   // Lv 42
  431300,   // Lv 43
  460300,   // Lv 44
  492300,   // Lv 45
  525300,   // Lv 46
  559300,   // Lv 47
  594300,   // Lv 48
  630300,   // Lv 49
  670300,   // Lv 50
  711300,   // Lv 51
  753300,   // Lv 52
  796300,   // Lv 53
  840300,   // Lv 54
  887300,   // Lv 55
  935300,   // Lv 56
  984300,   // Lv 57
  1034300,  // Lv 58
  1085300,  // Lv 59
  1140300,  // Lv 60
  1196300,  // Lv 61
  1253300,  // Lv 62
  1311300,  // Lv 63
  1370300,  // Lv 64
  1432300,  // Lv 65
  1495300,  // Lv 66
  1559300,  // Lv 67
  1624300,  // Lv 68
  1690300,  // Lv 69
  1760300,  // Lv 70
  1831300,  // Lv 71
  1903300,  // Lv 72
  1976300,  // Lv 73
  2050300,  // Lv 74
  2127300,  // Lv 75
  2205300,  // Lv 76
  2284300,  // Lv 77
  2364300,  // Lv 78
  2445300,  // Lv 79
  2530300,  // Lv 80
  2616300,  // Lv 81
  2703300,  // Lv 82
  2791300,  // Lv 83
  2880300,  // Lv 84
  2972300,  // Lv 85
  3065300,  // Lv 86
  3159300,  // Lv 87
  3254300,  // Lv 88
  3350300,  // Lv 89
  3450300,  // Lv 90
  3551300,  // Lv 91
  3653300,  // Lv 92
  3756300,  // Lv 93
  3860300,  // Lv 94
  3967300,  // Lv 95
  4075300,  // Lv 96
  4184300,  // Lv 97
  4294300,  // Lv 98
  4405300,  // Lv 99
  // ── Lv 100 〜 500（上限） ──────────────────────────────────────────
  4525300,  // Lv 100
  4647300,  // Lv 101
  4771300,  // Lv 102
  4897300,  // Lv 103
  5025300,  // Lv 104
  5155300,  // Lv 105
  5287300,  // Lv 106
  5421300,  // Lv 107
  5557300,  // Lv 108
  5695300,  // Lv 109
  5840300,  // Lv 110
  5988300,  // Lv 111
  6139300,  // Lv 112
  6293300,  // Lv 113
  6450300,  // Lv 114
  6610300,  // Lv 115
  6773300,  // Lv 116
  6939300,  // Lv 117
  7108300,  // Lv 118
  7280300,  // Lv 119
  7460300,  // Lv 120
  7645300,  // Lv 121
  7835300,  // Lv 122
  8030300,  // Lv 123
  8230300,  // Lv 124
  8435300,  // Lv 125
  8645300,  // Lv 126
  8860300,  // Lv 127
  9080300,  // Lv 128
  9305300,  // Lv 129
  9540300,  // Lv 130
  9783300,  // Lv 131
  10034300, // Lv 132
  10293300, // Lv 133
  10560300, // Lv 134
  10835300, // Lv 135
  11118300, // Lv 136
  11409300, // Lv 137
  11708300, // Lv 138
  12015300, // Lv 139
  12335300, // Lv 140
  12667300, // Lv 141
  13011300, // Lv 142
  13367300, // Lv 143
  13735300, // Lv 144
  14115300, // Lv 145
  14507300, // Lv 146
  14911300, // Lv 147
  15327300, // Lv 148
  15755300, // Lv 149
  16200300, // Lv 150
  16663300, // Lv 151
  17144300, // Lv 152
  17643300, // Lv 153
  18160300, // Lv 154
  18695300, // Lv 155
  19248300, // Lv 156
  19819300, // Lv 157
  20408300, // Lv 158
  21015300, // Lv 159
  21645300, // Lv 160
  22300300, // Lv 161
  22980300, // Lv 162
  23685300, // Lv 163
  24415300, // Lv 164
  25170300, // Lv 165
  25950300, // Lv 166
  26755300, // Lv 167
  27585300, // Lv 168
  28440300, // Lv 169
  29325300, // Lv 170
  30245300, // Lv 171
  31200300, // Lv 172
  32190300, // Lv 173
  33215300, // Lv 174
  34275300, // Lv 175
  35370300, // Lv 176
  36500300, // Lv 177
  37665300, // Lv 178
  38865300, // Lv 179
  40105300, // Lv 180
  41390300, // Lv 181
  42720300, // Lv 182
  44095300, // Lv 183
  45515300, // Lv 184
  46980300, // Lv 185
  48490300, // Lv 186
  50045300, // Lv 187
  51645300, // Lv 188
  53290300, // Lv 189
  54985300, // Lv 190
  56730300, // Lv 191
  58535300, // Lv 192
  60400300, // Lv 193
  62325300, // Lv 194
  64310300, // Lv 195
  66355300, // Lv 196
  68460300, // Lv 197
  70625300, // Lv 198
  72850300, // Lv 199
  75135300, // Lv 200
  77505300, // Lv 201
  79955300, // Lv 202
  82485300, // Lv 203
  85095300, // Lv 204
  87785300, // Lv 205
  90555300, // Lv 206
  93405300, // Lv 207
  96335300, // Lv 208
  99345300, // Lv 209
  102435300, // Lv 210
  105640300, // Lv 211
  108955300, // Lv 212
  112380300, // Lv 213
  115915300, // Lv 214
  119560300, // Lv 215
  123315300, // Lv 216
  127180300, // Lv 217
  131155300, // Lv 218
  135240300, // Lv 219
  139435300, // Lv 220
  143785300, // Lv 221
  148285300, // Lv 222
  152935300, // Lv 223
  157735300, // Lv 224
  162685300, // Lv 225
  167785300, // Lv 226
  173035300, // Lv 227
  178435300, // Lv 228
  183985300, // Lv 229
  189685300, // Lv 230
  195595300, // Lv 231
  201710300, // Lv 232
  208030300, // Lv 233
  214555300, // Lv 234
  221285300, // Lv 235
  228220300, // Lv 236
  235360300, // Lv 237
  242705300, // Lv 238
  250255300, // Lv 239
  258010300, // Lv 240
  266050300, // Lv 241
  274370300, // Lv 242
  282970300, // Lv 243
  291850300, // Lv 244
  301010300, // Lv 245
  310450300, // Lv 246
  320170300, // Lv 247
  330170300, // Lv 248
  340450300, // Lv 249
  351010300, // Lv 250
  361955300, // Lv 251
  373280300, // Lv 252
  384985300, // Lv 253
  397070300, // Lv 254
  409535300, // Lv 255
  422380300, // Lv 256
  435605300, // Lv 257
  449210300, // Lv 258
  463195300, // Lv 259
  477560300, // Lv 260
  492445300, // Lv 261
  507845300, // Lv 262
  523760300, // Lv 263
  540190300, // Lv 264
  557135300, // Lv 265
  574595300, // Lv 266
  592570300, // Lv 267
  611060300, // Lv 268
  630065300, // Lv 269
  649585300, // Lv 270
  669810300, // Lv 271
  690735300, // Lv 272
  712360300, // Lv 273
  734685300, // Lv 274
  757710300, // Lv 275
  781435300, // Lv 276
  805860300, // Lv 277
  830985300, // Lv 278
  856810300, // Lv 279
  883335300, // Lv 280
  910815300, // Lv 281
  939245300, // Lv 282
  968625300, // Lv 283
  998955300, // Lv 284
  1030235300, // Lv 285
  1062465300, // Lv 286
  1095645300, // Lv 287
  1129775300, // Lv 288
  1164855300, // Lv 289
  1200885300, // Lv 290
  1238210300, // Lv 291
  1276825300, // Lv 292
  1316730300, // Lv 293
  1357925300, // Lv 294
  1400410300, // Lv 295
  1444185300, // Lv 296
  1489250300, // Lv 297
  1535605300, // Lv 298
  1583250300, // Lv 299
  1632185300, // Lv 300
  1682880300, // Lv 301
  1735330300, // Lv 302
  1789535300, // Lv 303
  1845495300, // Lv 304
  1903210300, // Lv 305
  1962680300, // Lv 306
  2023905300, // Lv 307
  2086885300, // Lv 308
  2151620300, // Lv 309
  2218110300, // Lv 310
  2286990300, // Lv 311
  2358255300, // Lv 312
  2431905300, // Lv 313
  2507940300, // Lv 314
  2586360300, // Lv 315
  2667165300, // Lv 316
  2750355300, // Lv 317
  2835930300, // Lv 318
  2923890300, // Lv 319
  3014235300, // Lv 320
  3107830300, // Lv 321
  3204670300, // Lv 322
  3304755300, // Lv 323
  3408085300, // Lv 324
  3514660300, // Lv 325
  3624480300, // Lv 326
  3737545300, // Lv 327
  3853855300, // Lv 328
  3973410300, // Lv 329
  4096210300, // Lv 330
  4223430300, // Lv 331
  4355065300, // Lv 332
  4491115300, // Lv 333
  4631580300, // Lv 334
  4776460300, // Lv 335
  4925755300, // Lv 336
  5079465300, // Lv 337
  5237590300, // Lv 338
  5400130300, // Lv 339
  5567085300, // Lv 340
  5740050300, // Lv 341
  5919020300, // Lv 342
  6103995300, // Lv 343
  6294975300, // Lv 344
  6491960300, // Lv 345
  6694950300, // Lv 346
  6903945300, // Lv 347
  7118945300, // Lv 348
  7339950300, // Lv 349
  7566960300, // Lv 350
  7802140300, // Lv 351
  8045485300, // Lv 352
  8296995300, // Lv 353
  8556670300, // Lv 354
  8824510300, // Lv 355
  9100515300, // Lv 356
  9384685300, // Lv 357
  9677020300, // Lv 358
  9977520300, // Lv 359
  10286185300, // Lv 360
  10605960300, // Lv 361
  10936840300, // Lv 362
  11278825300, // Lv 363
  11631915300, // Lv 364
  11996110300, // Lv 365
  12371410300, // Lv 366
  12757815300, // Lv 367
  13155325300, // Lv 368
  13563940300, // Lv 369
  13983660300, // Lv 370
  14418490300, // Lv 371
  14868425300, // Lv 372
  15333465300, // Lv 373
  15813610300, // Lv 374
  16308860300, // Lv 375
  16819215300, // Lv 376
  17344675300, // Lv 377
  17885240300, // Lv 378
  18440910300, // Lv 379
  19011685300, // Lv 380
  19603010300, // Lv 381
  20214880300, // Lv 382
  20847295300, // Lv 383
  21500255300, // Lv 384
  22173760300, // Lv 385
  22867810300, // Lv 386
  23582405300, // Lv 387
  24317545300, // Lv 388
  25073230300, // Lv 389
  25849460300, // Lv 390
  26653635300, // Lv 391
  27485750300, // Lv 392
  28345805300, // Lv 393
  29233800300, // Lv 394
  30149735300, // Lv 395
  31093610300, // Lv 396
  32065425300, // Lv 397
  33065180300, // Lv 398
  34092875300, // Lv 399
  35148510300, // Lv 400
  36242150300, // Lv 401
  37373790300, // Lv 402
  38543430300, // Lv 403
  39751070300, // Lv 404
  40996710300, // Lv 405
  42280350300, // Lv 406
  43601990300, // Lv 407
  44961630300, // Lv 408
  46359270300, // Lv 409
  47794910300, // Lv 410
  49282235300, // Lv 411
  50821240300, // Lv 412
  52411925300, // Lv 413
  54054290300, // Lv 414
  55748335300, // Lv 415
  57494060300, // Lv 416
  59291465300, // Lv 417
  61140550300, // Lv 418
  63041315300, // Lv 419
  64993760300, // Lv 420
  67016495300, // Lv 421
  69109515300, // Lv 422
  71272820300, // Lv 423
  73506410300, // Lv 424
  75810285300, // Lv 425
  78184445300, // Lv 426
  80628890300, // Lv 427
  83143620300, // Lv 428
  85728635300, // Lv 429
  88383935300, // Lv 430
  91134830300, // Lv 431
  93981315300, // Lv 432
  96923390300, // Lv 433
  99961055300, // Lv 434
  103094310300, // Lv 435
  106323155300, // Lv 436
  109647590300, // Lv 437
  113067615300, // Lv 438
  116583230300, // Lv 439
  120194435300, // Lv 440
  123935645300, // Lv 441
  127806855300, // Lv 442
  131808065300, // Lv 443
  135939275300, // Lv 444
  140200485300, // Lv 445
  144591695300, // Lv 446
  149112905300, // Lv 447
  153764115300, // Lv 448
  158545325300, // Lv 449
  163456535300, // Lv 450
  168544550300, // Lv 451
  173809365300, // Lv 452
  179250980300, // Lv 453
  184869395300, // Lv 454
  190664610300, // Lv 455
  196636625300, // Lv 456
  202785440300, // Lv 457
  209111055300, // Lv 458
  215613470300, // Lv 459
  222292685300, // Lv 460
  229212355300, // Lv 461
  236372475300, // Lv 462
  243773045300, // Lv 463
  251414065300, // Lv 464
  259295535300, // Lv 465
  267417455300, // Lv 466
  275779825300, // Lv 467
  284382645300, // Lv 468
  293225915300, // Lv 469
  302309635300, // Lv 470
  311720370300, // Lv 471
  321458115300, // Lv 472
  331522870300, // Lv 473
  341914635300, // Lv 474
  352633410300, // Lv 475
  363679195300, // Lv 476
  375051990300, // Lv 477
  386751795300, // Lv 478
  398778610300, // Lv 479
  411132435300, // Lv 480
  423931000300, // Lv 481
  437174300300, // Lv 482
  450862335300, // Lv 483
  464995105300, // Lv 484
  479572610300, // Lv 485
  494594850300, // Lv 486
  510061825300, // Lv 487
  525973535300, // Lv 488
  542329980300, // Lv 489
  559131160300, // Lv 490
  576537185300, // Lv 491
  594548050300, // Lv 492
  613163755300, // Lv 493
  632384300300, // Lv 494
  652209685300, // Lv 495
  672639910300, // Lv 496
  693674975300, // Lv 497
  715314880300, // Lv 498
  737559625300, // Lv 499
  760409210300, // Lv 500（上限）
];

/* ==============================================================
   スキルツリー定義
   各ルート 22 ノード（既存15 + 新規7）。
   各ルートのノードコスト合計: 既存30SP + 新規17SP = 47SP × 4ルート = 全ノード合計 188SP。
   プレイヤーが Lv99 までに獲得できる SP は最大 236 pt
   （Lv2〜20は5の倍数は5pt・それ以外は3pt=65pt、Lv21〜50は5の倍数は5pt・それ以外は4pt=126pt、
     Lv51〜99は5の倍数は5pt・それ以外は0pt=45pt）
   Lv100〜500 では 10 の倍数レベルのみ 5pt 付与（合計205pt）。
   Lv500 総計: 441pt（5ルート合計235ptに対して206pt余裕）。
   ============================================================== */

const SKILL_TREE_DEFINITIONS = [

  /* ──────────────────────────────────────────────────────────
     剣士ルート（攻撃特化）
     ATK ボーナスが充実し、高倍率の斬撃スキルを習得できる
     MP 消費は少なめ
     ────────────────────────────────────────────────────────── */
  {
    id:          'swordsman',
    name:        '剣士',
    description: '攻撃特化ルート。ATK ボーナスが最も高く、強力な斬撃スキルを習得できる。MP 消費は少なめ。',
    nodes: [
      {
        id: 'sw_01', name: '鍛錬の型',
        type: 'stat', description: 'ATK +3',
        bonuses: { atk: 3 }, cost: 1, requires: null,
      },
      {
        id: 'sw_02', name: '剣の心得',
        type: 'stat', description: 'ATK +3',
        bonuses: { atk: 3 }, cost: 1, requires: 'sw_01',
      },
      {
        id: 'sw_03', name: '居合の構え',
        type: 'stat', description: 'ATK +4',
        bonuses: { atk: 4 }, cost: 1, requires: 'sw_02',
      },
      {
        id: 'sw_04', name: '剣技練磨',
        type: 'stat', description: 'ATK +5',
        bonuses: { atk: 5 }, cost: 1, requires: 'sw_03',
      },
      {
        id: 'sw_05', name: '鉄壁の肉体',
        type: 'stat', description: 'DEF +3',
        bonuses: { def: 3 }, cost: 1, requires: 'sw_04',
      },
      {
        id: 'sw_06', name: '居合斬り',
        type: 'skill', skillId: 'iai_slash',
        description: '高速の一撃（ATK×1.5 / MP:12 / 25%で防御を無視する会心）',
        mpCost: 12, bonuses: {}, cost: 2, requires: 'sw_05',
      },
      {
        id: 'sw_07', name: '猛攻の型',
        type: 'stat', description: 'ATK +6',
        bonuses: { atk: 6 }, cost: 2, requires: 'sw_06',
      },
      {
        id: 'sw_08', name: '荒ぶる刃',
        type: 'stat', description: 'ATK +6',
        bonuses: { atk: 6 }, cost: 2, requires: 'sw_07',
      },
      {
        id: 'sw_09', name: '戦士の心',
        type: 'stat', description: 'HP +20',
        bonuses: { hp: 20 }, cost: 2, requires: 'sw_08',
      },
      {
        id: 'sw_10', name: '連続斬り',
        type: 'skill', skillId: 'chain_slash',
        description: '3 回連続攻撃（MP:15）',
        mpCost: 15, bonuses: {}, cost: 2, requires: 'sw_09',
      },
      {
        id: 'sw_11', name: '剣聖の修練',
        type: 'stat', description: 'ATK +8',
        bonuses: { atk: 8 }, cost: 3, requires: 'sw_10',
      },
      {
        id: 'sw_12', name: '鋼の意志',
        type: 'stat', description: 'DEF +5 / HP +15',
        bonuses: { def: 5, hp: 15 }, cost: 3, requires: 'sw_11',
      },
      {
        id: 'sw_13', name: '雷光斬り',
        type: 'skill', skillId: 'thunder_slash',
        description: '雷を纏った強斬り（ATK×2.0 / MP:18）',
        mpCost: 18, bonuses: {}, cost: 3, requires: 'sw_12',
      },
      {
        id: 'sw_14', name: '絶剣',
        type: 'stat', description: 'ATK +10',
        bonuses: { atk: 10 }, cost: 3, requires: 'sw_13',
      },
      {
        id: 'sw_15', name: '必殺剣',
        type: 'skill', skillId: 'death_blow',
        description: '防御を無視する必殺の一撃（ATK×2.5 / MP:25 / 防御無視）',
        mpCost: 25, bonuses: {}, cost: 3, requires: 'sw_14',
      },
      {
        id: 'sw_16', name: '剣聖の極意',
        type: 'stat', description: 'ATK +10',
        bonuses: { atk: 10 }, cost: 2, requires: 'sw_15',
      },
      {
        id: 'sw_17', name: '流星斬り',
        type: 'skill', skillId: 'shooting_star',
        description: '光速の 2 連撃（ATK×1.3×2 / MP:22）',
        mpCost: 22, bonuses: {}, cost: 2, requires: 'sw_16',
      },
      {
        id: 'sw_18', name: '剣聖の真髄',
        type: 'stat', description: 'ATK +12',
        bonuses: { atk: 12 }, cost: 2, requires: 'sw_17',
      },
      {
        id: 'sw_19', name: '影縫い',
        type: 'stat', description: 'DEF +8 / HP +20',
        bonuses: { def: 8, hp: 20 }, cost: 2, requires: 'sw_18',
      },
      {
        id: 'sw_20', name: '崩壊斬り',
        type: 'skill', skillId: 'ruin_slash',
        description: '存在を断つ斬撃（ATK×3.0 / MP:35）',
        mpCost: 35, bonuses: {}, cost: 3, requires: 'sw_19',
      },
      {
        id: 'sw_21', name: '神剣の境地',
        type: 'stat', description: 'ATK +15 / HP +30',
        bonuses: { atk: 15, hp: 30 }, cost: 3, requires: 'sw_20',
      },
      {
        id: 'sw_22', name: '天地無用剣',
        type: 'skill', skillId: 'peerless_blade',
        description: '天地を貫く 3 連撃（ATK×1.4×3 / MP:45）',
        mpCost: 45, bonuses: {}, cost: 3, requires: 'sw_21',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     魔法ルート（魔法攻撃特化）
     MP ボーナスが最も高く、高威力の魔法攻撃と回復魔法を習得できる
     ────────────────────────────────────────────────────────── */
  {
    id:          'mage',
    name:        '魔法',
    description: '魔法攻撃特化ルート。MP が大幅に増え、高威力の攻撃魔法と回復魔法を習得できる。',
    nodes: [
      {
        id: 'mg_01', name: '魔法の才能',
        type: 'stat', description: 'MP +8',
        bonuses: { mp: 8 }, cost: 1, requires: null,
      },
      {
        id: 'mg_02', name: '初級魔法',
        type: 'stat', description: 'MP +8',
        bonuses: { mp: 8 }, cost: 1, requires: 'mg_01',
      },
      {
        id: 'mg_03', name: '魔力の流れ',
        type: 'stat', description: 'MP +10',
        bonuses: { mp: 10 }, cost: 1, requires: 'mg_02',
      },
      {
        id: 'mg_04', name: '炎の心得',
        type: 'stat', description: 'ATK +3',
        bonuses: { atk: 3 }, cost: 1, requires: 'mg_03',
      },
      {
        id: 'mg_05', name: '魔法防壁',
        type: 'stat', description: 'DEF +3',
        bonuses: { def: 3 }, cost: 1, requires: 'mg_04',
      },
      {
        id: 'mg_06', name: 'ファイア',
        type: 'skill', skillId: 'fire',
        description: '炎の魔法（ATK×1.6 / MP:20）',
        mpCost: 20, bonuses: {}, cost: 2, requires: 'mg_05',
      },
      {
        id: 'mg_07', name: '魔法練磨',
        type: 'stat', description: 'MP +12',
        bonuses: { mp: 12 }, cost: 2, requires: 'mg_06',
      },
      {
        id: 'mg_08', name: '高速詠唱',
        type: 'stat', description: 'ATK +5',
        bonuses: { atk: 5 }, cost: 2, requires: 'mg_07',
      },
      {
        id: 'mg_09', name: 'サンダー',
        type: 'skill', skillId: 'thunder',
        description: '雷の魔法（ATK×1.8 / MP:28）',
        mpCost: 28, bonuses: {}, cost: 2, requires: 'mg_08',
      },
      {
        id: 'mg_10', name: '魔法回復',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 2, requires: 'mg_09',
      },
      {
        id: 'mg_11', name: '上位魔法',
        type: 'stat', description: 'MP +15',
        bonuses: { mp: 15 }, cost: 3, requires: 'mg_10',
      },
      {
        id: 'mg_12', name: '治癒魔法',
        type: 'skill', skillId: 'heal_magic',
        description: '自分を回復する（HP+40+Lv×3 / MP:18）',
        mpCost: 18, bonuses: {}, cost: 3, requires: 'mg_11',
      },
      {
        id: 'mg_13', name: 'ブリザド',
        type: 'skill', skillId: 'blizzard',
        description: '氷の魔法（ATK×2.2 / MP:38）',
        mpCost: 38, bonuses: {}, cost: 3, requires: 'mg_12',
      },
      {
        id: 'mg_14', name: '大魔力',
        type: 'stat', description: 'ATK +5 / MP +20',
        bonuses: { atk: 5, mp: 20 }, cost: 3, requires: 'mg_13',
      },
      {
        id: 'mg_15', name: '大魔法陣',
        type: 'skill', skillId: 'grand_magic',
        description: '究極の魔法攻撃（ATK×3.0 / MP:65）',
        mpCost: 65, bonuses: {}, cost: 3, requires: 'mg_14',
      },
      {
        id: 'mg_16', name: '魔力覚醒',
        type: 'stat', description: 'ATK +8 / MP +20',
        bonuses: { atk: 8, mp: 20 }, cost: 2, requires: 'mg_15',
      },
      {
        id: 'mg_17', name: 'メテオ',
        type: 'skill', skillId: 'meteor',
        description: '隕石の魔法（ATK×2.8 / MP:55）',
        mpCost: 55, bonuses: {}, cost: 2, requires: 'mg_16',
      },
      {
        id: 'mg_18', name: '超魔力',
        type: 'stat', description: 'ATK +8 / MP +25',
        bonuses: { atk: 8, mp: 25 }, cost: 2, requires: 'mg_17',
      },
      {
        id: 'mg_19', name: '魔力爆発',
        type: 'skill', skillId: 'magic_explosion',
        description: '魔力を爆発させる（ATK×3.5 / MP:85）',
        mpCost: 85, bonuses: {}, cost: 2, requires: 'mg_18',
      },
      {
        id: 'mg_20', name: '大魔力覚醒',
        type: 'stat', description: 'ATK +10 / MP +30',
        bonuses: { atk: 10, mp: 30 }, cost: 3, requires: 'mg_19',
      },
      {
        id: 'mg_21', name: 'リジェネ',
        type: 'skill', skillId: 'regen',
        description: '再生の魔法（3ターン HP+20+Lv×0.5/ターン / MP:28）',
        mpCost: 28, bonuses: {}, cost: 3, requires: 'mg_20',
      },
      {
        id: 'mg_22', name: '時空魔法',
        type: 'skill', skillId: 'spacetime_magic',
        description: '時空を歪める魔法（ATK×5.0 / MP:120）',
        mpCost: 120, bonuses: {}, cost: 3, requires: 'mg_21',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     僧侶ルート（回復・バフ特化）
     HP/MP/DEF がバランスよく伸び、回復魔法とバフスキルを習得できる
     ────────────────────────────────────────────────────────── */
  {
    id:          'cleric',
    name:        '僧侶',
    description: '回復・バフ特化ルート。HP と MP が大幅に増え、回復魔法と防御バフを習得できる。',
    nodes: [
      {
        id: 'cl_01', name: '聖なる心',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 1, requires: null,
      },
      {
        id: 'cl_02', name: '癒しの手',
        type: 'stat', description: 'MP +8',
        bonuses: { mp: 8 }, cost: 1, requires: 'cl_01',
      },
      {
        id: 'cl_03', name: '祈りの力',
        type: 'stat', description: 'DEF +3',
        bonuses: { def: 3 }, cost: 1, requires: 'cl_02',
      },
      {
        id: 'cl_04', name: '生命の泉',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 1, requires: 'cl_03',
      },
      {
        id: 'cl_05', name: '霊力強化',
        type: 'stat', description: 'MP +10',
        bonuses: { mp: 10 }, cost: 1, requires: 'cl_04',
      },
      {
        id: 'cl_06', name: 'ホーリーライト',
        type: 'skill', skillId: 'holy_light',
        description: '聖なる光で回復（HP+30+Lv×2 / MP:12）',
        mpCost: 12, bonuses: {}, cost: 2, requires: 'cl_05',
      },
      {
        id: 'cl_07', name: '聖壁の守り',
        type: 'stat', description: 'DEF +5',
        bonuses: { def: 5 }, cost: 2, requires: 'cl_06',
      },
      {
        id: 'cl_08', name: '神聖な鎧',
        type: 'stat', description: 'DEF +5 / HP +20',
        bonuses: { def: 5, hp: 20 }, cost: 2, requires: 'cl_07',
      },
      {
        id: 'cl_09', name: '祝福',
        type: 'skill', skillId: 'bless',
        description: '自分に ATK+25 バフ（5 ターン / MP:15）',
        mpCost: 15, bonuses: {}, cost: 2, requires: 'cl_08',
      },
      {
        id: 'cl_10', name: '回復の詩',
        type: 'stat', description: 'HP +20 / MP +8',
        bonuses: { hp: 20, mp: 8 }, cost: 2, requires: 'cl_09',
      },
      {
        id: 'cl_11', name: '大回復',
        type: 'skill', skillId: 'big_heal',
        description: '大きく HP を回復（HP+50+Lv×3 / MP:22）',
        mpCost: 22, bonuses: {}, cost: 3, requires: 'cl_10',
      },
      {
        id: 'cl_12', name: '聖域',
        type: 'skill', skillId: 'sanctuary',
        description: '防御バリア（DEF+40 / 4 ターン / MP:18）',
        mpCost: 18, bonuses: {}, cost: 3, requires: 'cl_11',
      },
      {
        id: 'cl_13', name: '神の恵み',
        type: 'stat', description: 'HP +30 / MP +15',
        bonuses: { hp: 30, mp: 15 }, cost: 3, requires: 'cl_12',
      },
      {
        id: 'cl_14', name: '復活の光',
        type: 'stat', description: 'HP +25',
        bonuses: { hp: 25 }, cost: 3, requires: 'cl_13',
      },
      {
        id: 'cl_15', name: '神聖魔法',
        type: 'skill', skillId: 'divine_heal',
        description: '神聖な力で大回復（HP+60+Lv×4 / MP:42）',
        mpCost: 42, bonuses: {}, cost: 3, requires: 'cl_14',
      },
      {
        id: 'cl_16', name: '聖なる覚醒',
        type: 'stat', description: 'HP +35 / MP +20',
        bonuses: { hp: 35, mp: 20 }, cost: 2, requires: 'cl_15',
      },
      {
        id: 'cl_17', name: '祝福の歌',
        type: 'skill', skillId: 'battle_hymn',
        description: '戦いの歌で ATK+40（6 ターン / MP:22）',
        mpCost: 22, bonuses: {}, cost: 2, requires: 'cl_16',
      },
      {
        id: 'cl_18', name: '神の慈悲',
        type: 'stat', description: 'HP +40 / DEF +10',
        bonuses: { hp: 40, def: 10 }, cost: 2, requires: 'cl_17',
      },
      {
        id: 'cl_19', name: '神の護り',
        type: 'skill', skillId: 'divine_shield',
        description: '神の盾で大幅防御（DEF+80 / 5 ターン / MP:30）',
        mpCost: 30, bonuses: {}, cost: 2, requires: 'cl_18',
      },
      {
        id: 'cl_20', name: '天恵の光',
        type: 'stat', description: 'HP +30 / MP +20',
        bonuses: { hp: 30, mp: 20 }, cost: 3, requires: 'cl_19',
      },
      {
        id: 'cl_21', name: '神聖なうたい寝',
        type: 'skill', skillId: 'holy_slumber',
        description: '神聖な歌声で眠りを誘い、3ターン後にHPを大回復する（HP+100+Lv×4 / MP:55）',
        mpCost: 55, bonuses: {}, cost: 3, requires: 'cl_20',
      },
      {
        id: 'cl_22', name: '奇跡の加護',
        type: 'stat', description: 'HP +50 / DEF +15 / MP +20',
        bonuses: { hp: 50, def: 15, mp: 20 }, cost: 3, requires: 'cl_21',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     戦士ルート（デバフ・バランス特化）
     ATK/DEF/HP がバランスよく伸び、スタンやデバフスキルを習得できる
     ────────────────────────────────────────────────────────── */
  {
    id:          'warrior',
    name:        '戦士',
    description: 'デバフ・バランス特化ルート。ATK/DEF/HP が均等に伸び、敵を弱体化させるスキルを習得できる。',
    nodes: [
      {
        id: 'wt_01', name: '体術の基礎',
        type: 'stat', description: 'ATK +3',
        bonuses: { atk: 3 }, cost: 1, requires: null,
      },
      {
        id: 'wt_02', name: '防御の構え',
        type: 'stat', description: 'DEF +3',
        bonuses: { def: 3 }, cost: 1, requires: 'wt_01',
      },
      {
        id: 'wt_03', name: '鍛え上げた体',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 1, requires: 'wt_02',
      },
      {
        id: 'wt_04', name: '俊敏',
        type: 'stat', description: 'ATK +3 / DEF +2',
        bonuses: { atk: 3, def: 2 }, cost: 1, requires: 'wt_03',
      },
      {
        id: 'wt_05', name: '粘り強さ',
        type: 'stat', description: 'HP +15',
        bonuses: { hp: 15 }, cost: 1, requires: 'wt_04',
      },
      {
        id: 'wt_06', name: '足払い',
        type: 'skill', skillId: 'trip',
        description: '足を払う（ATK×1.2 / MP:12 / 15%でスタン＋必ずATK低下）',
        mpCost: 12, bonuses: {}, cost: 2, requires: 'wt_05',
      },
      {
        id: 'wt_07', name: '剛腕',
        type: 'stat', description: 'ATK +5',
        bonuses: { atk: 5 }, cost: 2, requires: 'wt_06',
      },
      {
        id: 'wt_08', name: '鉄壁',
        type: 'stat', description: 'DEF +5 / HP +10',
        bonuses: { def: 5, hp: 10 }, cost: 2, requires: 'wt_07',
      },
      {
        id: 'wt_09', name: '威嚇',
        type: 'skill', skillId: 'intimidate',
        description: '敵の攻撃力を 3 ターン大幅低下（MP:15）',
        mpCost: 15, bonuses: {}, cost: 2, requires: 'wt_08',
      },
      {
        id: 'wt_10', name: '突破口',
        type: 'stat', description: 'ATK +5 / HP +15',
        bonuses: { atk: 5, hp: 15 }, cost: 2, requires: 'wt_09',
      },
      {
        id: 'wt_11', name: '体当たり',
        type: 'skill', skillId: 'body_slam',
        description: '強烈な体当たり（ATK×1.6 / MP:15 / 20%でスタン＋必ずATK大幅低下）',
        mpCost: 15, bonuses: {}, cost: 3, requires: 'wt_10',
      },
      {
        id: 'wt_12', name: '鋼鉄の肉体',
        type: 'stat', description: 'DEF +8 / HP +25',
        bonuses: { def: 8, hp: 25 }, cost: 3, requires: 'wt_11',
      },
      {
        id: 'wt_13', name: '戦闘の覚醒',
        type: 'stat', description: 'ATK +8',
        bonuses: { atk: 8 }, cost: 3, requires: 'wt_12',
      },
      {
        id: 'wt_14', name: '破壊の一撃',
        type: 'skill', skillId: 'devastating_blow',
        description: '強打＋敵の攻撃力を 3 ターン大幅低下（ATK×2.0 / MP:22）',
        mpCost: 22, bonuses: {}, cost: 3, requires: 'wt_13',
      },
      {
        id: 'wt_15', name: '不屈の戦士',
        type: 'stat', description: 'ATK +5 / DEF +5 / HP +30',
        bonuses: { atk: 5, def: 5, hp: 30 }, cost: 3, requires: 'wt_14',
      },
      {
        id: 'wt_16', name: '覚醒の咆哮',
        type: 'stat', description: 'ATK +8 / DEF +8',
        bonuses: { atk: 8, def: 8 }, cost: 2, requires: 'wt_15',
      },
      {
        id: 'wt_17', name: '大地砕き',
        type: 'skill', skillId: 'earth_crash',
        description: '大地を砕く一撃（ATK×2.2 / MP:22 / 15%でスタン＋必ずATK大幅低下）',
        mpCost: 22, bonuses: {}, cost: 2, requires: 'wt_16',
      },
      {
        id: 'wt_18', name: '鋼鉄の意志',
        type: 'stat', description: 'DEF +12 / HP +35',
        bonuses: { def: 12, hp: 35 }, cost: 2, requires: 'wt_17',
      },
      {
        id: 'wt_19', name: '滅却の一撃',
        type: 'skill', skillId: 'annihilation',
        description: '敵を滅却する強打（ATK×3.0 ＋ 3ターンATK壊滅的デバフ / MP:32）',
        mpCost: 32, bonuses: {}, cost: 2, requires: 'wt_18',
      },
      {
        id: 'wt_20', name: '無双の体',
        type: 'stat', description: 'ATK +10 / DEF +10 / HP +40',
        bonuses: { atk: 10, def: 10, hp: 40 }, cost: 3, requires: 'wt_19',
      },
      {
        id: 'wt_21', name: '戦神の覚醒',
        type: 'skill', skillId: 'battle_trance',
        description: '戦神として覚醒（ATK+35 ＋ DEF+25 / 4ターン / MP:38）',
        mpCost: 38, bonuses: {}, cost: 3, requires: 'wt_20',
      },
      {
        id: 'wt_22', name: '鬼神の一撃',
        type: 'skill', skillId: 'ogre_strike',
        description: '鬼神の力を込めた大一撃（ATK×4.0 / MP:55 / 25%でスタン＋必ずATK強力低下）',
        mpCost: 55, bonuses: {}, cost: 3, requires: 'wt_21',
      },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     魔剣士ルート（剣士×魔法の上位互換）
     ATK・MP ボーナスが高く、MP 消費を伴う超高火力スキルを習得できる。
     全4ルートMAX＋魔剣士の書を取得後に解放される特別ルート。
     ────────────────────────────────────────────────────────── */
  {
    id:          'makenshi',
    name:        '魔剣士',
    description: '剣士×魔法の上位互換ルート。ATK・MP が大幅に伸び、全ルート最高クラスの火力スキルを習得できる。解放条件：全4ルートMAX＋魔剣士の書。',
    nodes: [
      {
        id: 'mk_01', name: '魔力の心得',
        type: 'stat', description: 'MP +8（蒼銀の剣装備時、全ステータス1.2倍）',
        bonuses: { mp: 8 }, cost: 1, requires: null,
      },
      {
        id: 'mk_02', name: '剣魔の型',
        type: 'stat', description: 'ATK +3',
        bonuses: { atk: 3 }, cost: 1, requires: 'mk_01',
      },
      {
        id: 'mk_03', name: '魔力展開',
        type: 'stat', description: 'MP +10',
        bonuses: { mp: 10 }, cost: 1, requires: 'mk_02',
      },
      {
        id: 'mk_04', name: '魔剣の基礎',
        type: 'stat', description: 'ATK +4',
        bonuses: { atk: 4 }, cost: 1, requires: 'mk_03',
      },
      {
        id: 'mk_05', name: '剣魔の融合',
        type: 'stat', description: 'ATK +4 / MP +5',
        bonuses: { atk: 4, mp: 5 }, cost: 1, requires: 'mk_04',
      },
      {
        // パッシブ: 通常攻撃が「MP回復攻撃」に変化する（威力×0.6・MP +30 回復）
        id: 'mk_06', name: 'MP回復攻撃',
        type: 'passive',
        description: 'パッシブ：通常攻撃が「MP回復攻撃」に変化する（威力×0.6 / MP +30 回復）',
        bonuses: {}, cost: 2, requires: 'mk_05',
      },
      {
        id: 'mk_07', name: '魔力強化',
        type: 'stat', description: 'ATK +6',
        bonuses: { atk: 6 }, cost: 2, requires: 'mk_06',
      },
      {
        id: 'mk_08', name: '魔力蓄積',
        type: 'stat', description: 'MP +15',
        bonuses: { mp: 15 }, cost: 2, requires: 'mk_07',
      },
      {
        id: 'mk_09', name: '魔力凝縮',
        type: 'skill', skillId: 'magic_condense',
        description: '魔力を凝縮し次の攻撃を強化（次ターン ATK×4.0・被ダメ×1.5 / MP:50）',
        mpCost: 50, bonuses: {}, cost: 3, requires: 'mk_08',
      },
      {
        id: 'mk_10', name: '魔剣の極意',
        type: 'passive', description: '【パッシブ】現在MPの割合に応じてATKが上昇（ATK × (1 + MP/MaxMP)）',
        bonuses: {}, cost: 2, requires: 'mk_09',
      },
      {
        id: 'mk_11', name: '魔剣強撃',
        type: 'skill', skillId: 'magic_sword_strike',
        description: '魔力を纏った強撃（ATK×3.5 / MP:40 / 40%で防御を無視する会心）',
        mpCost: 40, bonuses: {}, cost: 3, requires: 'mk_10',
      },
      {
        id: 'mk_12', name: '深淵の魔力',
        type: 'stat', description: 'ATK +10 / MP +18',
        bonuses: { atk: 10, mp: 18 }, cost: 3, requires: 'mk_11',
      },
      {
        id: 'mk_13', name: '魔力爆破斬',
        type: 'skill', skillId: 'magic_burst_slash',
        description: '魔剣で爆裂する一撃（物理ATK×4.5 + 魔法ATK×0.8追加 / MP:55）',
        mpCost: 55, bonuses: {}, cost: 3, requires: 'mk_12',
      },
      {
        id: 'mk_14', name: '究極の剣技',
        type: 'stat', description: 'ATK +12',
        bonuses: { atk: 12 }, cost: 3, requires: 'mk_13',
      },
      {
        id: 'mk_15', name: '魔力防壁',
        type: 'stat', description: 'ATK +8 / DEF +5',
        bonuses: { atk: 8, def: 5 }, cost: 2, requires: 'mk_14',
      },
      {
        id: 'mk_16', name: '魔力の海',
        type: 'stat', description: 'MP +20',
        bonuses: { mp: 20 }, cost: 2, requires: 'mk_15',
      },
      {
        id: 'mk_17', name: '魔剣烈風斬',
        type: 'skill', skillId: 'magic_gale_slash',
        description: '魔力の嵐を纏った 2 連撃（ATK×2.8×2 / MP:60）',
        mpCost: 60, bonuses: {}, cost: 2, requires: 'mk_16',
      },
      {
        id: 'mk_18', name: '魔剣士の真髄',
        type: 'stat', description: 'ATK +10 / DEF +8',
        bonuses: { atk: 10, def: 8 }, cost: 2, requires: 'mk_17',
      },
      {
        id: 'mk_19', name: '無限の魔力',
        type: 'stat', description: 'MP +25',
        bonuses: { mp: 25 }, cost: 2, requires: 'mk_18',
      },
      {
        id: 'mk_20', name: '魔剣士の覚醒',
        type: 'skill', skillId: 'makenshi_awakening',
        description: '魔剣士として覚醒（ATK×1.5 / 3ターン + DEF×1.3 / 3ターン / MP:70）',
        mpCost: 70, bonuses: {}, cost: 3, requires: 'mk_19',
      },
      {
        id: 'mk_21', name: '魔剣の神髄',
        type: 'stat', description: 'ATK +15 / MP +30',
        bonuses: { atk: 15, mp: 30 }, cost: 3, requires: 'mk_20',
      },
      {
        id: 'mk_22', name: '絶界魔剣斬',
        type: 'skill', skillId: 'absolute_magic_slash',
        description: '全魔力を解放する究極の一撃（ATK×9.0 / MP:130 / 防御完全無視）',
        mpCost: 130, bonuses: {}, cost: 3, requires: 'mk_21',
      },
    ],
  },
  {
    id: 'paladin',
    name: '聖騎士',
    description: '僧侶×戦士の上位ルート。被ダメージ軽減・自己回復・カウンターを備えた耐久型職業。全4ルートMAX＋聖騎士の書で解放。',
    nodes: [
      { id: 'pl_01', name: '聖騎士の刻印', type: 'passive', description: 'パッシブ：神聖の穿槍装備中：全ステータス×1.2倍', bonuses: {}, cost: 1, requires: null },
      { id: 'pl_02', name: '聖なる体力', type: 'stat', description: 'HP +20', bonuses: { hp: 20 }, cost: 1, requires: 'pl_01' },
      { id: 'pl_03', name: '守護の誓い', type: 'stat', description: 'DEF +5', bonuses: { def: 5 }, cost: 1, requires: 'pl_02' },
      { id: 'pl_04', name: '神の加護', type: 'stat', description: 'HP +20', bonuses: { hp: 20 }, cost: 1, requires: 'pl_03' },
      { id: 'pl_05', name: '聖騎士の誓約', type: 'stat', description: 'DEF +8 / HP +15', bonuses: { def: 8, hp: 15 }, cost: 1, requires: 'pl_04' },
      { id: 'pl_06', name: '聖盾', type: 'passive', description: 'パッシブ：被ダメージを10%軽減する', bonuses: {}, cost: 2, requires: 'pl_05' },
      { id: 'pl_07', name: '聖剣の道', type: 'stat', description: 'ATK +5', bonuses: { atk: 5 }, cost: 2, requires: 'pl_06' },
      { id: 'pl_08', name: '神聖な壁', type: 'stat', description: 'DEF +8 / HP +20', bonuses: { def: 8, hp: 20 }, cost: 2, requires: 'pl_07' },
      { id: 'pl_09', name: '聖盾展開', type: 'skill', skillId: 'paladin_heal', description: '聖なる盾を展開しDEFを1.5倍にする（3ターン / MP:40 / 重複発動不可）', mpCost: 40, bonuses: {}, cost: 2, requires: 'pl_08' },
      { id: 'pl_10', name: '神聖強化', type: 'stat', description: 'ATK +5 / DEF +5', bonuses: { atk: 5, def: 5 }, cost: 2, requires: 'pl_09' },
      { id: 'pl_11', name: '聖騎士の鎧', type: 'stat', description: 'DEF +12 / HP +30', bonuses: { def: 12, hp: 30 }, cost: 3, requires: 'pl_10' },
      { id: 'pl_12', name: '神聖防壁', type: 'passive', description: 'パッシブ：被ダメージをさらに20%軽減する（聖盾と合計30%軽減）', bonuses: {}, cost: 3, requires: 'pl_11' },
      { id: 'pl_13', name: '聖剣強化', type: 'stat', description: 'ATK +8', bonuses: { atk: 8 }, cost: 3, requires: 'pl_12' },
      { id: 'pl_14', name: '神聖回復', type: 'skill', skillId: 'paladin_big_heal', description: '最大HPの15%を2ターンリジェネ（敵攻撃前回復 / MP:50 / 重複発動不可）', mpCost: 50, bonuses: {}, cost: 3, requires: 'pl_13' },
      { id: 'pl_15', name: '反撃の構え', type: 'passive', description: 'パッシブ：被攻撃時30%の確率でカウンター攻撃を行う（神聖無双発動中は100%）', bonuses: {}, cost: 3, requires: 'pl_14' },
      { id: 'pl_16', name: '聖域の覚醒', type: 'stat', description: 'ATK +8 / DEF +10', bonuses: { atk: 8, def: 10 }, cost: 2, requires: 'pl_15' },
      { id: 'pl_17', name: '神盾突き', type: 'skill', skillId: 'shield_bash', description: '盾で強打しDEFを1.3倍にする（ATK×1.5 / MP:60 / DEF×1.3 4ターン / 重複発動不可）', mpCost: 60, bonuses: {}, cost: 2, requires: 'pl_16' },
      { id: 'pl_18', name: '聖騎士の覚醒', type: 'stat', description: 'ATK +10 / DEF +15 / HP +30', bonuses: { atk: 10, def: 15, hp: 30 }, cost: 2, requires: 'pl_17' },
      { id: 'pl_19', name: '聖光斬り', type: 'skill', skillId: 'holy_slash', description: '聖なる光の斬撃（ATK×3 / MP:80 / 自己HP最大値35%回復）', mpCost: 80, bonuses: {}, cost: 2, requires: 'pl_18' },
      { id: 'pl_20', name: '神聖なる守護', type: 'stat', description: 'DEF +15 / HP +40', bonuses: { def: 15, hp: 40 }, cost: 3, requires: 'pl_19' },
      { id: 'pl_21', name: '聖騎士の至高', type: 'stat', description: 'ATK +12 / DEF +20 / HP +50', bonuses: { atk: 12, def: 20, hp: 50 }, cost: 3, requires: 'pl_20' },
      { id: 'pl_22', name: '神聖無双', type: 'skill', skillId: 'divine_judgment', description: '神聖なる究極解放（MP:250 / 最大HP30%リジェネ3ターン＋DEF×1.5＋反撃100% / 重複発動不可）', mpCost: 250, bonuses: {}, cost: 3, requires: 'pl_21' },
    ],
  },
  {
    id: 'assassin',
    name: '暗殺者',
    description: '剣士×戦士の上位ルート。HP・防御力が半減する代わりに会心率・防御無視特化の超攻撃型職業。全4ルートMAX＋暗殺者の書で解放。',
    nodes: [
      { id: 'as_01', name: '暗殺者の刻印', type: 'passive', description: 'パッシブ：黒曜の短剣装備中：全ステータス×1.2倍', bonuses: {}, cost: 1, requires: null },
      { id: 'as_02', name: '影の心得', type: 'stat', description: 'ATK +5', bonuses: { atk: 5 }, cost: 1, requires: 'as_01' },
      { id: 'as_03', name: '急所の見切り', type: 'stat', description: 'ATK +5', bonuses: { atk: 5 }, cost: 1, requires: 'as_02' },
      { id: 'as_04', name: '影の速さ', type: 'stat', description: 'ATK +6', bonuses: { atk: 6 }, cost: 1, requires: 'as_03' },
      { id: 'as_05', name: '暗殺の技', type: 'stat', description: 'ATK +6', bonuses: { atk: 6 }, cost: 1, requires: 'as_04' },
      { id: 'as_06', name: '会心強化', type: 'passive', description: 'パッシブ：会心率を大幅に上昇させる（攻撃時50%で会心・防御無視）', bonuses: {}, cost: 2, requires: 'as_05' },
      { id: 'as_07', name: '刃の磨き', type: 'stat', description: 'ATK +8', bonuses: { atk: 8 }, cost: 2, requires: 'as_06' },
      { id: 'as_08', name: '防御貫通', type: 'passive', description: 'パッシブ：通常攻撃が常に防御を無視する', bonuses: {}, cost: 2, requires: 'as_07' },
      { id: 'as_09', name: '四連撃', type: 'skill', skillId: 'quad_slash', description: '4回連続攻撃（各ATK×0.9 防御無視 / MP:20）', mpCost: 20, bonuses: {}, cost: 2, requires: 'as_08' },
      { id: 'as_10', name: '暗殺者の牙', type: 'stat', description: 'ATK +10', bonuses: { atk: 10 }, cost: 2, requires: 'as_09' },
      { id: 'as_11', name: '超会心', type: 'passive', description: 'パッシブ：会心率をさらに上昇（攻撃時70%で会心・防御無視）', bonuses: {}, cost: 3, requires: 'as_10' },
      { id: 'as_12', name: '影忍び', type: 'skill', skillId: 'shadow_stab', description: '防御を完全に無視する一撃（ATK×3.0 防御完全無視 / MP:30）', mpCost: 30, bonuses: {}, cost: 3, requires: 'as_11' },
      { id: 'as_13', name: '死の刃', type: 'stat', description: 'ATK +12', bonuses: { atk: 12 }, cost: 3, requires: 'as_12' },
      { id: 'as_14', name: '五連撃', type: 'skill', skillId: 'penta_slash', description: '5回連続攻撃（各ATK×1.0 防御無視 / MP:25）', mpCost: 25, bonuses: {}, cost: 3, requires: 'as_13' },
      { id: 'as_15', name: '必殺刃', type: 'skill', skillId: 'killing_edge', description: '一撃必殺の超高火力（ATK×6.0 防御完全無視 / MP:50）', mpCost: 50, bonuses: {}, cost: 3, requires: 'as_14' },
      { id: 'as_16', name: '暗殺者の極意', type: 'stat', description: 'ATK +15', bonuses: { atk: 15 }, cost: 2, requires: 'as_15' },
      { id: 'as_17', name: '影乱れ斬り', type: 'skill', skillId: 'shadow_flurry', description: '4連撃（ATK×1.5 防御完全無視 各ヒット / MP:45）', mpCost: 45, bonuses: {}, cost: 2, requires: 'as_16' },
      { id: 'as_18', name: '暗殺者の真髄', type: 'stat', description: 'ATK +15', bonuses: { atk: 15 }, cost: 2, requires: 'as_17' },
      { id: 'as_19', name: '死神の一撃', type: 'skill', skillId: 'death_reaper', description: '死神の鎌（ATK×8.0 防御完全無視 / MP:60）', mpCost: 60, bonuses: {}, cost: 2, requires: 'as_18' },
      { id: 'as_20', name: '究極の暗殺', type: 'stat', description: 'ATK +20', bonuses: { atk: 20 }, cost: 3, requires: 'as_19' },
      { id: 'as_21', name: '影の覚醒', type: 'stat', description: 'ATK +20', bonuses: { atk: 20 }, cost: 3, requires: 'as_20' },
      { id: 'as_22', name: '奈落落とし', type: 'skill', skillId: 'abyss_drop', description: '奈落へ叩き落とす（ATK×12.0 防御完全無視 / MP:80）', mpCost: 80, bonuses: {}, cost: 3, requires: 'as_21' },
    ],
  },
  {
    id: 'sage',
    name: '賢者',
    description: '魔法×僧侶の上位ルート。攻撃魔法と回復を兼ね備えた万能型。与ダメージの一部をHP回復するパッシブが強力。全4ルートMAX＋賢者の書で解放。',
    nodes: [
      { id: 'sg_01', name: '賢者の素養', type: 'passive', description: 'パッシブ：翠賢の杖装備中：全ステータス×1.2倍', bonuses: {}, cost: 1, requires: null },
      { id: 'sg_02', name: '知識の蓄積', type: 'stat', description: 'ATK +3 / MP +8', bonuses: { atk: 3, mp: 8 }, cost: 1, requires: 'sg_01' },
      { id: 'sg_03', name: '魔力の体現', type: 'stat', description: 'ATK +4 / MP +5', bonuses: { atk: 4, mp: 5 }, cost: 1, requires: 'sg_02' },
      { id: 'sg_04', name: '治癒の流れ', type: 'stat', description: 'HP +15 / MP +8', bonuses: { hp: 15, mp: 8 }, cost: 1, requires: 'sg_03' },
      { id: 'sg_05', name: '賢者の慧眼', type: 'stat', description: 'ATK +4 / DEF +3', bonuses: { atk: 4, def: 3 }, cost: 1, requires: 'sg_04' },
      { id: 'sg_06', name: '吸魔', type: 'passive', description: 'パッシブ：攻撃ダメージの5%をHPとして回収する', bonuses: {}, cost: 2, requires: 'sg_05' },
      { id: 'sg_07', name: '魔力強化', type: 'stat', description: 'ATK +6 / MP +10', bonuses: { atk: 6, mp: 10 }, cost: 2, requires: 'sg_06' },
      { id: 'sg_08', name: '属性魔法', type: 'skill', skillId: 'sage_blast', description: '属性攻撃+自己回復（ATK×1.0 / 最大HPの15%回復 / MP:60）', mpCost: 60, bonuses: {}, cost: 2, requires: 'sg_07' },
      { id: 'sg_09', name: '弱体魔法', type: 'skill', skillId: 'sage_debuff', description: '敵ATKを大幅低下（3ターン ATK×0.45 / MP:36）', mpCost: 36, bonuses: {}, cost: 2, requires: 'sg_08' },
      { id: 'sg_10', name: '知恵の光', type: 'stat', description: 'ATK +6 / HP +20 / MP +10', bonuses: { atk: 6, hp: 20, mp: 10 }, cost: 2, requires: 'sg_09' },
      { id: 'sg_11', name: '強化魔法', type: 'skill', skillId: 'sage_buff', description: '自己ATK・DEFを倍率強化（ATK×1.2 / DEF×1.2 / 5ターン / MP:44）', mpCost: 44, bonuses: {}, cost: 3, requires: 'sg_10' },
      { id: 'sg_12', name: '魔力増幅', type: 'passive', description: 'パッシブ：最大MPが1.3倍になる', bonuses: {}, cost: 3, requires: 'sg_11' },
      { id: 'sg_13', name: '賢者の技', type: 'stat', description: 'ATK +8 / MP +15', bonuses: { atk: 8, mp: 15 }, cost: 3, requires: 'sg_12' },
      { id: 'sg_14', name: '聖魔融合', type: 'skill', skillId: 'holy_magic_fusion', description: '攻撃+回復（ATK×2.5 / 最大HPの10%回復 / MP:80）', mpCost: 80, bonuses: {}, cost: 3, requires: 'sg_13' },
      { id: 'sg_15', name: '魔力崩壊', type: 'skill', skillId: 'magic_collapse', description: '敵を弱体化しつつ攻撃（ATK×1.5 / 3ターン ATK×0.40デバフ / MP:70）', mpCost: 70, bonuses: {}, cost: 3, requires: 'sg_14' },
      { id: 'sg_16', name: '賢者の極意', type: 'stat', description: 'ATK +10 / MP +20', bonuses: { atk: 10, mp: 20 }, cost: 2, requires: 'sg_15' },
      { id: 'sg_17', name: '賢者の覚醒', type: 'stat', description: 'ATK +10 / HP +30 / MP +15', bonuses: { atk: 10, hp: 30, mp: 15 }, cost: 2, requires: 'sg_16' },
      { id: 'sg_18', name: '知恵の波動', type: 'skill', skillId: 'wisdom_wave', description: '攻撃+大回復（ATK×3.5 / 最大HPの20%回復 / MP:110）', mpCost: 110, bonuses: {}, cost: 2, requires: 'sg_17' },
      { id: 'sg_19', name: '全体強化', type: 'skill', skillId: 'sage_mega_buff', description: '強力な自己倍率バフ（ATK×1.5 / DEF×1.4 / 4ターン / MP:80）', mpCost: 80, bonuses: {}, cost: 2, requires: 'sg_18' },
      { id: 'sg_20', name: '究極吸魔', type: 'stat', description: 'ATK +12 / HP +30 / MP +20', bonuses: { atk: 12, hp: 30, mp: 20 }, cost: 3, requires: 'sg_19' },
      { id: 'sg_21', name: '賢者の真髄', type: 'stat', description: 'ATK +15 / MP +25', bonuses: { atk: 15, mp: 25 }, cost: 3, requires: 'sg_20' },
      { id: 'sg_22', name: '絶対魔法', type: 'skill', skillId: 'absolute_magic', description: '究極魔法（ATK×7.0 / 与えたダメージの50%HP回復 / MP:200）', mpCost: 200, bonuses: {}, cost: 3, requires: 'sg_21' },
    ],
  },
  {
    id: 'berserker',
    name: '狂戦士',
    description: '戦士×剣士の上位ルート。HP50%以下で攻撃力2倍、HP25%以下で4倍になる超ハイリスクハイリターン型。全4ルートMAX＋狂戦士の書で解放。',
    nodes: [
      { id: 'bk_01', name: '狂戦士の刻印', type: 'passive', description: 'パッシブ：狂血斧装備中：全ステータス×1.2倍', bonuses: {}, cost: 1, requires: null },
      { id: 'bk_02', name: '血の咆哮', type: 'stat', description: 'ATK +8', bonuses: { atk: 8 }, cost: 1, requires: 'bk_01' },
      { id: 'bk_03', name: '怒りの力', type: 'stat', description: 'ATK +8', bonuses: { atk: 8 }, cost: 1, requires: 'bk_02' },
      { id: 'bk_04', name: '破壊本能', type: 'stat', description: 'ATK +10', bonuses: { atk: 10 }, cost: 1, requires: 'bk_03' },
      { id: 'bk_05', name: '狂乱の目', type: 'stat', description: 'ATK +10', bonuses: { atk: 10 }, cost: 1, requires: 'bk_04' },
      { id: 'bk_06', name: '血の代償', type: 'skill', skillId: 'blood_price', description: 'HP30を消費して強烈な一撃（ATK×2.5 防御無視 / MP:20 / HP:30消費）', mpCost: 20, bonuses: {}, cost: 2, requires: 'bk_05' },
      { id: 'bk_07', name: '獣化', type: 'stat', description: 'ATK +12', bonuses: { atk: 12 }, cost: 2, requires: 'bk_06' },
      { id: 'bk_08', name: '血の嵐', type: 'stat', description: 'ATK +12', bonuses: { atk: 12 }, cost: 2, requires: 'bk_07' },
      { id: 'bk_09', name: '狂乱突き', type: 'skill', skillId: 'berserk_stab', description: '狂乱の突き（ATK×2.0 / MP:30）', mpCost: 30, bonuses: {}, cost: 2, requires: 'bk_08' },
      { id: 'bk_10', name: '怒りの炎', type: 'stat', description: 'ATK +15', bonuses: { atk: 15 }, cost: 2, requires: 'bk_09' },
      { id: 'bk_11', name: '狂戦士の鼓動', type: 'stat', description: 'ATK +15', bonuses: { atk: 15 }, cost: 3, requires: 'bk_10' },
      { id: 'bk_12', name: '自傷攻撃', type: 'skill', skillId: 'self_harm_strike', description: '最大HPの20%を消費して強烈な一撃（ATK×3.5 防御完全無視 / MP:40）', mpCost: 40, bonuses: {}, cost: 3, requires: 'bk_11' },
      { id: 'bk_13', name: '血の一撃', type: 'stat', description: 'ATK +18', bonuses: { atk: 18 }, cost: 3, requires: 'bk_12' },
      { id: 'bk_14', name: '絶命の刃', type: 'skill', skillId: 'lethal_blade', description: '致命の一撃（ATK×4.0 / MP:60）', mpCost: 60, bonuses: {}, cost: 3, requires: 'bk_13' },
      { id: 'bk_15', name: '死力の境地', type: 'stat', description: 'ATK +20', bonuses: { atk: 20 }, cost: 3, requires: 'bk_14' },
      { id: 'bk_16', name: '狂乱の極意', type: 'stat', description: 'ATK +18', bonuses: { atk: 18 }, cost: 2, requires: 'bk_15' },
      { id: 'bk_17', name: '血の蹂躙', type: 'skill', skillId: 'blood_rampage', description: '血に狂った2連撃（ATK×3.0×2 / MP:50）', mpCost: 50, bonuses: {}, cost: 2, requires: 'bk_16' },
      { id: 'bk_18', name: '狂戦士の真髄', type: 'stat', description: 'ATK +20', bonuses: { atk: 20 }, cost: 2, requires: 'bk_17' },
      { id: 'bk_19', name: '怒りの暴走', type: 'skill', skillId: 'berserk_rampage', description: '最大HPの30%を消費して大爆発（ATK×6.0 防御完全無視 / MP:60）', mpCost: 60, bonuses: {}, cost: 2, requires: 'bk_18' },
      { id: 'bk_20', name: '終末の力', type: 'stat', description: 'ATK +25', bonuses: { atk: 25 }, cost: 3, requires: 'bk_19' },
      { id: 'bk_21', name: '狂神の覚醒', type: 'stat', description: 'ATK +30', bonuses: { atk: 30 }, cost: 3, requires: 'bk_20' },
      { id: 'bk_22', name: '絶滅の一撃', type: 'skill', skillId: 'annihilation_strike', description: '最大HPの50%を消費して究極爆発（ATK×12.0 防御完全無視 / MP:100）', mpCost: 100, bonuses: {}, cost: 3, requires: 'bk_21' },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     クルセイダールート（聖騎士の特級職）
     合計SPコスト：105SP（特級職専用コスト体系）
     ────────────────────────────────────────────────────────── */
  {
    id: 'crusader',
    name: 'クルセイダー',
    description: '聖騎士の特級職。絶対的な守護と神聖なる剣技を極めた究極の守護者。',
    nodes: [
      { id: 'cr_01', name: 'クルセイダーの刻印', type: 'stat', description: 'HP +20', bonuses: { hp: 20 }, cost: 3, requires: null },
      { id: 'cr_02', name: '神聖な防壁', type: 'stat', description: 'DEF +5', bonuses: { def: 5 }, cost: 3, requires: 'cr_01' },
      { id: 'cr_03', name: '聖盾の強化', type: 'stat', description: 'HP +20', bonuses: { hp: 20 }, cost: 3, requires: 'cr_02' },
      { id: 'cr_04', name: '神聖の誓い', type: 'stat', description: 'DEF +8 / HP +15', bonuses: { def: 8, hp: 15 }, cost: 3, requires: 'cr_03' },
      { id: 'cr_05', name: '天守の加護', type: 'stat', description: 'ATK +5 / DEF +5', bonuses: { atk: 5, def: 5 }, cost: 3, requires: 'cr_04' },
      // パッシブ①（刻印系）：被ダメージ15%軽減（聖騎士の軽減に追加）
      { id: 'cr_06', name: '聖域の守護', type: 'passive', description: 'パッシブ：被ダメージをさらに15%軽減する（聖騎士の聖盾・神聖防壁に加算）', bonuses: {}, cost: 5, requires: 'cr_05' },
      { id: 'cr_07', name: '神撃の腕力', type: 'stat', description: 'ATK +8', bonuses: { atk: 8 }, cost: 4, requires: 'cr_06' },
      { id: 'cr_08', name: '鉄壁の聖鎧', type: 'stat', description: 'DEF +10 / HP +25', bonuses: { def: 10, hp: 25 }, cost: 4, requires: 'cr_07' },
      { id: 'cr_09', name: '聖域展開', type: 'skill', skillId: 'cr_skill_01', description: '聖域を展開しDEF×1.7バフ2ターン＋即時HP10%回復（MP:70 / 重複不可）', mpCost: 70, bonuses: {}, cost: 4, requires: 'cr_08' },
      { id: 'cr_10', name: '聖騎士の極意', type: 'stat', description: 'ATK +8 / DEF +8', bonuses: { atk: 8, def: 8 }, cost: 4, requires: 'cr_09' },
      { id: 'cr_11', name: '天盾の守り', type: 'stat', description: 'DEF +15 / HP +35', bonuses: { def: 15, hp: 35 }, cost: 4, requires: 'cr_10' },
      // パッシブ②：聖盾展開スキルを上書き
      { id: 'cr_12', name: '聖なる反撃', type: 'passive', description: 'パッシブ：カウンター攻撃時にHP最大値の5%を回復する。「聖盾展開」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'paladin_heal', requires: 'cr_11' },
      { id: 'cr_13', name: '神聖なる剛腕', type: 'stat', description: 'ATK +10', bonuses: { atk: 10 }, cost: 5, requires: 'cr_12' },
      { id: 'cr_14', name: 'クルセイドヒール', type: 'skill', skillId: 'cr_skill_02', description: '即時最大HP20%回復＋2ターン後に最大HP20%回復（MP:80）', mpCost: 80, bonuses: {}, cost: 5, requires: 'cr_13' },
      // パッシブ③：神聖回復スキルを上書き
      { id: 'cr_15', name: '絶対防壁', type: 'passive', description: 'パッシブ：シールド効果中の全被ダメージを0にする。「神聖回復」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'paladin_big_heal', requires: 'cr_14' },
      { id: 'cr_16', name: '聖域の覚醒', type: 'stat', description: 'ATK +10 / DEF +12', bonuses: { atk: 10, def: 12 }, cost: 5, requires: 'cr_15' },
      { id: 'cr_17', name: 'クルセイドバッシュ', type: 'skill', skillId: 'cr_skill_03', description: 'ATK×1.5ダメージ＋DEF×1.5バフ3ターン＋敵ATK×0.7デバフ3ターン（MP:120）', mpCost: 120, bonuses: {}, cost: 5, requires: 'cr_16' },
      { id: 'cr_18', name: '天守の真髄', type: 'stat', description: 'ATK +12 / DEF +18 / HP +40', bonuses: { atk: 12, def: 18, hp: 40 }, cost: 6, requires: 'cr_17' },
      { id: 'cr_19', name: '聖十字斬', type: 'skill', skillId: 'cr_skill_04', description: 'ATK×2.5の2連撃＋最大HP40%即時回復（MP:130）', mpCost: 130, bonuses: {}, cost: 6, requires: 'cr_18' },
      { id: 'cr_20', name: '神聖なる究極守護', type: 'stat', description: 'DEF +20 / HP +50', bonuses: { def: 20, hp: 50 }, cost: 6, requires: 'cr_19' },
      { id: 'cr_21', name: 'クルセイダーの至高', type: 'stat', description: 'ATK +15 / DEF +25 / HP +60', bonuses: { atk: 15, def: 25, hp: 60 }, cost: 6, requires: 'cr_20' },
      // 最終奥義
      { id: 'cr_22', name: 'クルセイドアポカリプス', type: 'skill', skillId: 'cr_skill_05', description: '即時HP50%回復＋敵ATK・DEF段階デバフ＋3ターン後ATK×20防御無視ダメージ（MP:450 / バトル中3ターンに1回）', mpCost: 450, bonuses: {}, cost: 9, requires: 'cr_21' },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     ファントムルート（暗殺者の特級職）
     合計SPコスト：105SP（特級職専用コスト体系）
     ────────────────────────────────────────────────────────── */
  {
    id: 'phantom',
    name: 'ファントム',
    description: '暗殺者の特級職。影の極致に達した絶対的な暗殺者。',
    nodes: [
      { id: 'ph_01', name: 'ファントムの刻印', type: 'stat', description: 'ATK +8', bonuses: { atk: 8 }, cost: 3, requires: null },
      { id: 'ph_02', name: '幻影の速さ', type: 'stat', description: 'ATK +8', bonuses: { atk: 8 }, cost: 3, requires: 'ph_01' },
      { id: 'ph_03', name: '闇の技法', type: 'stat', description: 'ATK +10', bonuses: { atk: 10 }, cost: 3, requires: 'ph_02' },
      { id: 'ph_04', name: '影の刃', type: 'stat', description: 'ATK +10', bonuses: { atk: 10 }, cost: 3, requires: 'ph_03' },
      { id: 'ph_05', name: '幻影の切れ味', type: 'stat', description: 'ATK +12', bonuses: { atk: 12 }, cost: 3, requires: 'ph_04' },
      // パッシブ①（刻印系）：毎ターン開始時に攻撃無効化確率+20%加算
      { id: 'ph_06', name: '完全幻影', type: 'passive', description: 'パッシブ：敵ターン開始時に攻撃無効化確率+20%加算（phantomAvoidChance）', bonuses: {}, cost: 5, requires: 'ph_05' },
      { id: 'ph_07', name: '闇の覇気', type: 'stat', description: 'ATK +15', bonuses: { atk: 15 }, cost: 4, requires: 'ph_06' },
      { id: 'ph_08', name: '幻影強化', type: 'stat', description: 'ATK +15', bonuses: { atk: 15 }, cost: 4, requires: 'ph_07' },
      { id: 'ph_09', name: '影四連斬', type: 'skill', skillId: 'ph_skill_01', description: 'ATK×1.0の4連撃・防御無視＋使用ターン攻撃無効化確率+30%（MP:200）', mpCost: 200, bonuses: {}, cost: 4, requires: 'ph_08' },
      { id: 'ph_10', name: '幻影忍び', type: 'skill', skillId: 'ph_skill_02', description: '使用ターン攻撃無効化確率+50%加算＋次ターンATK×4.0ダメージ（MP:90）', mpCost: 90, bonuses: {}, cost: 4, requires: 'ph_09' },
      { id: 'ph_11', name: '幻影の鋭刃', type: 'stat', description: 'ATK +20', bonuses: { atk: 20 }, cost: 5, requires: 'ph_10' },
      // パッシブ②：影忍びスキルを上書き
      { id: 'ph_12', name: '影の極致', type: 'passive', description: 'パッシブ：攻撃無効化成功後に次ターンATK×1.5バフを付与する。「影忍び」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'shadow_stab', requires: 'ph_11' },
      { id: 'ph_13', name: 'ファントムラッシュ', type: 'skill', skillId: 'ph_skill_03', description: '会心率+30%＋ATK×1.2の5連撃・防御無視（MP:120）', mpCost: 120, bonuses: {}, cost: 4, requires: 'ph_12' },
      { id: 'ph_14', name: '亡霊の刃', type: 'skill', skillId: 'ph_skill_04', description: 'ATK×3.0防御無視＋攻撃無効化確率+20%＋毎ターンATK×4.0防御無視追加ダメージ（MP:180）', mpCost: 180, bonuses: {}, cost: 5, requires: 'ph_13' },
      // パッシブ③：必殺刃スキルを上書き
      { id: 'ph_15', name: '完全暗殺', type: 'passive', description: 'パッシブ：防御無視攻撃のダメージが10%増加する。「必殺刃」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'killing_edge', requires: 'ph_14' },
      { id: 'ph_16', name: '虚影乱れ斬り', type: 'skill', skillId: 'ph_skill_05', description: 'ATK×2.0の4連撃・防御無視（各撃25%で攻撃無効化確率加算・重複なし）（MP:220）', mpCost: 220, bonuses: {}, cost: 5, requires: 'ph_15' },
      { id: 'ph_17', name: '亡霊の死撃', type: 'skill', skillId: 'ph_skill_06', description: '2ターン間敵攻撃無効化確率+50%＋3ターン後に無効化回数×ATK×20防御無視ダメージ（MP:400）', mpCost: 400, bonuses: {}, cost: 5, requires: 'ph_16' },
      { id: 'ph_18', name: '影の覚醒', type: 'stat', description: 'ATK +25', bonuses: { atk: 25 }, cost: 6, requires: 'ph_17' },
      { id: 'ph_19', name: '暗殺神の覚醒', type: 'stat', description: 'ATK +30', bonuses: { atk: 30 }, cost: 6, requires: 'ph_18' },
      { id: 'ph_20', name: '影の極限', type: 'stat', description: 'ATK +35', bonuses: { atk: 35 }, cost: 6, requires: 'ph_19' },
      { id: 'ph_21', name: 'ファントムの至高', type: 'stat', description: 'ATK +40', bonuses: { atk: 40 }, cost: 6, requires: 'ph_20' },
      // 最終奥義
      { id: 'ph_22', name: 'ファントムアビス', type: 'skill', skillId: 'ph_skill_07', description: '使用ターン攻撃無効化+100%→その後2ターン+30%→3ターン後ATK×100防御完全無視（MP:800）', mpCost: 800, bonuses: {}, cost: 9, requires: 'ph_21' },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     オラクルルート（賢者の特級職）
     合計SPコスト：105SP（特級職専用コスト体系）
     ────────────────────────────────────────────────────────── */
  {
    id: 'oracle',
    name: 'オラクル',
    description: '賢者の特級職。神の啓示を受けた全知全能の術者。',
    nodes: [
      { id: 'oc_01', name: 'オラクルの刻印', type: 'stat', description: 'ATK +5 / MP +10', bonuses: { atk: 5, mp: 10 }, cost: 3, requires: null },
      { id: 'oc_02', name: '神託の知識', type: 'stat', description: 'ATK +5 / MP +8', bonuses: { atk: 5, mp: 8 }, cost: 3, requires: 'oc_01' },
      { id: 'oc_03', name: '啓示の力', type: 'stat', description: 'ATK +6 / MP +10', bonuses: { atk: 6, mp: 10 }, cost: 3, requires: 'oc_02' },
      { id: 'oc_04', name: '神の眼', type: 'stat', description: 'HP +20 / MP +12', bonuses: { hp: 20, mp: 12 }, cost: 3, requires: 'oc_03' },
      { id: 'oc_05', name: '全知の慧眼', type: 'stat', description: 'ATK +6 / DEF +4', bonuses: { atk: 6, def: 4 }, cost: 3, requires: 'oc_04' },
      // パッシブ①（刻印系）：MP消費×0.9
      { id: 'oc_06', name: '神の摂理', type: 'passive', description: 'パッシブ：スキルのMP消費を×0.9にする（端数切り上げ）', bonuses: {}, cost: 5, requires: 'oc_05' },
      { id: 'oc_07', name: '啓示の魔力', type: 'stat', description: 'ATK +8 / MP +15', bonuses: { atk: 8, mp: 15 }, cost: 4, requires: 'oc_06' },
      { id: 'oc_08', name: '神の恵み', type: 'stat', description: 'HP +25 / MP +15', bonuses: { hp: 25, mp: 15 }, cost: 4, requires: 'oc_07' },
      { id: 'oc_09', name: '予言魔法', type: 'skill', skillId: 'oc_skill_01', description: '2ターン後にATK×5ダメージ＋最大HP30%回復（予言系 / MP:130）', mpCost: 130, bonuses: {}, cost: 4, requires: 'oc_08' },
      { id: 'oc_10', name: '神罰魔法', type: 'skill', skillId: 'oc_skill_02', description: 'バトル中敵ATK・DEF×0.5デバフ＋毎ターンATK×1ダメージ（MP:180）', mpCost: 180, bonuses: {}, cost: 4, requires: 'oc_09' },
      { id: 'oc_11', name: '神託の極意', type: 'stat', description: 'ATK +10 / MP +20', bonuses: { atk: 10, mp: 20 }, cost: 5, requires: 'oc_10' },
      // パッシブ②：属性攻撃スキルを上書き
      { id: 'oc_12', name: '啓示の奇跡', type: 'passive', description: 'パッシブ：予言系スキル（pendingEffects）の発動が1ターン早まる。「属性攻撃」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'sage_blast', requires: 'oc_11' },
      { id: 'oc_13', name: '天啓強化', type: 'skill', skillId: 'oc_skill_03', description: 'バトル中自ATK×1.3・DEF×1.3バフ＋MP消費×0.7（MP:250）', mpCost: 250, bonuses: {}, cost: 4, requires: 'oc_12' },
      { id: 'oc_14', name: '天啓聖魔', type: 'skill', skillId: 'oc_skill_04', description: '聖魔を3ターン召喚→ランダム行動、4ターン目に聖魔暴走（MP:350）', mpCost: 350, bonuses: {}, cost: 5, requires: 'oc_13' },
      // パッシブ③：弱体魔法スキルを上書き
      { id: 'oc_15', name: '全能の法則', type: 'passive', description: 'パッシブ：バトル中ATK×1.2の倍率バフを付与する（永続）。「弱体魔法」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'sage_debuff', requires: 'oc_14' },
      { id: 'oc_16', name: '予言の崩壊', type: 'skill', skillId: 'oc_skill_05', description: '予言待機中→強化即時発動、通常時→ATK×20＋最大HP20%回復（予言系 / MP:600）', mpCost: 600, bonuses: {}, cost: 5, requires: 'oc_15' },
      { id: 'oc_17', name: '予言の奔流', type: 'skill', skillId: 'oc_skill_06', description: 'バトル中予言系スキル効果×2（永続 / 予言系 / MP:500）', mpCost: 500, bonuses: {}, cost: 5, requires: 'oc_16' },
      { id: 'oc_18', name: '啓示の真髄', type: 'stat', description: 'ATK +15 / MP +30', bonuses: { atk: 15, mp: 30 }, cost: 6, requires: 'oc_17' },
      { id: 'oc_19', name: 'オラクルバースト', type: 'skill', skillId: 'oc_skill_07', description: 'バトル中ATK×3・DEF×2バフ＋MP消費×1.2デバフ（MP:400）', mpCost: 400, bonuses: {}, cost: 6, requires: 'oc_18' },
      { id: 'oc_20', name: '全知全能の力', type: 'stat', description: 'ATK +15 / MP +30', bonuses: { atk: 15, mp: 30 }, cost: 6, requires: 'oc_19' },
      { id: 'oc_21', name: 'オラクルの至高', type: 'stat', description: 'ATK +18 / HP +40 / MP +30', bonuses: { atk: 18, hp: 40, mp: 30 }, cost: 6, requires: 'oc_20' },
      // 最終奥義
      { id: 'oc_22', name: '終末予言', type: 'skill', skillId: 'oc_skill_08', description: '即時最大HP30%回復＋3ターン後ATK×200防御無視（予言系 / MP:1500）', mpCost: 1500, bonuses: {}, cost: 9, requires: 'oc_21' },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     カタストロフルート（狂戦士の特級職）
     合計SPコスト：105SP（特級職専用コスト体系）
     ────────────────────────────────────────────────────────── */
  {
    id: 'catastrophe',
    name: 'カタストロフ',
    description: '狂戦士の特級職。全てを破壊する終末の化身。',
    nodes: [
      { id: 'ct_01', name: 'カタストロフの刻印', type: 'stat', description: 'ATK +12', bonuses: { atk: 12 }, cost: 3, requires: null },
      { id: 'ct_02', name: '終末の咆哮', type: 'stat', description: 'ATK +12', bonuses: { atk: 12 }, cost: 3, requires: 'ct_01' },
      { id: 'ct_03', name: '破壊の怒り', type: 'stat', description: 'ATK +15', bonuses: { atk: 15 }, cost: 3, requires: 'ct_02' },
      { id: 'ct_04', name: '滅亡本能', type: 'stat', description: 'ATK +15', bonuses: { atk: 15 }, cost: 3, requires: 'ct_03' },
      { id: 'ct_05', name: '終焉の瞳', type: 'stat', description: 'ATK +18', bonuses: { atk: 18 }, cost: 3, requires: 'ct_04' },
      // パッシブ①（刻印系）：HP50%以下でATK+20%
      { id: 'ct_06', name: '絶滅の本能', type: 'passive', description: 'パッシブ：HP50%以下の時、ATKが20%上昇する', bonuses: {}, cost: 5, requires: 'ct_05' },
      { id: 'ct_07', name: '破壊神の腕力', type: 'stat', description: 'ATK +20', bonuses: { atk: 20 }, cost: 4, requires: 'ct_06' },
      { id: 'ct_08', name: '終末の嵐', type: 'stat', description: 'ATK +20', bonuses: { atk: 20 }, cost: 4, requires: 'ct_07' },
      { id: 'ct_09', name: '血の災厄', type: 'skill', skillId: 'ct_skill_01', description: 'ATK×6.0ダメージ＋最大HP10%消費（MP:250）', mpCost: 250, bonuses: {}, cost: 4, requires: 'ct_08' },
      { id: 'ct_10', name: '災厄の咆哮', type: 'skill', skillId: 'ct_skill_02', description: '30%でスタン＋3ターン間敵被ダメ×1.5（重複なし）（MP:120）', mpCost: 120, bonuses: {}, cost: 4, requires: 'ct_09' },
      { id: 'ct_11', name: '終末の鼓動', type: 'stat', description: 'ATK +25', bonuses: { atk: 25 }, cost: 5, requires: 'ct_10' },
      // パッシブ②：血の代償スキルを上書き
      { id: 'ct_12', name: '破滅の意志', type: 'passive', description: 'パッシブ：HP消費スキル使用時、消費HP分の20%をダメージに加算する。「血の代償」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'blood_price', requires: 'ct_11' },
      { id: 'ct_13', name: '破滅の傷', type: 'skill', skillId: 'ct_skill_03', description: '3ターン間毎ターン最大HP10%自傷＋バトル中ATK×5バフ＋確定会心（MP:300）', mpCost: 300, bonuses: {}, cost: 4, requires: 'ct_12' },
      { id: 'ct_14', name: '滅びの刃', type: 'skill', skillId: 'ct_skill_04', description: 'ATK×(最大HP-現在HP)×2倍ダメージ（MP:450）', mpCost: 450, bonuses: {}, cost: 5, requires: 'ct_13' },
      // パッシブ③：狂乱突きスキルを上書き
      { id: 'ct_15', name: '完全破壊', type: 'passive', description: 'パッシブ：通常攻撃がクリティカル時、追加でATK×1.0の防御無視ダメージを与える。「狂乱突き」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'berserk_stab', requires: 'ct_14' },
      { id: 'ct_16', name: '終末の極意', type: 'stat', description: 'ATK +30', bonuses: { atk: 30 }, cost: 5, requires: 'ct_15' },
      { id: 'ct_17', name: '狂血蹂躙', type: 'skill', skillId: 'ct_skill_05', description: 'ATK×4.0＋最大HP10%減少ごとに2連撃追加＋会心率+30%（MP:600）', mpCost: 600, bonuses: {}, cost: 5, requires: 'ct_16' },
      { id: 'ct_18', name: '破壊神の真髄', type: 'stat', description: 'ATK +32', bonuses: { atk: 32 }, cost: 6, requires: 'ct_17' },
      { id: 'ct_19', name: '滅亡の眼光', type: 'skill', skillId: 'ct_skill_06', description: '2ターン間敵ATK×0.2・DEF×0.5デバフ（MP:500）', mpCost: 500, bonuses: {}, cost: 6, requires: 'ct_18' },
      { id: 'ct_20', name: '終末の力', type: 'stat', description: 'ATK +35', bonuses: { atk: 35 }, cost: 6, requires: 'ct_19' },
      { id: 'ct_21', name: 'カタストロフの至高', type: 'stat', description: 'ATK +40', bonuses: { atk: 40 }, cost: 6, requires: 'ct_20' },
      // 最終奥義
      { id: 'ct_22', name: '破滅の絶撃', type: 'skill', skillId: 'ct_skill_07', description: '現在HP50%消費＋HP残量に応じてATK×50〜300（HP100%時→ATK×300）（MP:1000）', mpCost: 1000, bonuses: {}, cost: 9, requires: 'ct_21' },
    ],
  },

  /* ──────────────────────────────────────────────────────────
     ルーンナイトルート（魔剣士の特級職）
     合計SPコスト：105SP（特級職専用コスト体系）
     ────────────────────────────────────────────────────────── */
  {
    id: 'rune_knight',
    name: 'ルーンナイト',
    description: '魔剣士の特級職。魔法と剣の究極融合を極めた存在。',
    nodes: [
      { id: 'rk_01', name: 'ルーンナイトの刻印', type: 'stat', description: 'ATK +5 / MP +10', bonuses: { atk: 5, mp: 10 }, cost: 3, requires: null },
      { id: 'rk_02', name: 'ルーン刻印', type: 'stat', description: 'ATK +5 / MP +8', bonuses: { atk: 5, mp: 8 }, cost: 3, requires: 'rk_01' },
      { id: 'rk_03', name: '魔力の鎖', type: 'stat', description: 'ATK +6 / MP +12', bonuses: { atk: 6, mp: 12 }, cost: 3, requires: 'rk_02' },
      { id: 'rk_04', name: '剣魔の極意', type: 'stat', description: 'ATK +8 / MP +10', bonuses: { atk: 8, mp: 10 }, cost: 3, requires: 'rk_03' },
      { id: 'rk_05', name: 'ルーンの力', type: 'stat', description: 'ATK +8 / MP +8', bonuses: { atk: 8, mp: 8 }, cost: 3, requires: 'rk_04' },
      // パッシブ①（刻印系）：スキル使用時ATK×1.1
      { id: 'rk_06', name: '魔法剣の真髄', type: 'passive', description: 'パッシブ：スキル使用時のATKが10%上昇する（当ターン中）', bonuses: {}, cost: 5, requires: 'rk_05' },
      { id: 'rk_07', name: 'ルーン強化', type: 'stat', description: 'ATK +10 / MP +15', bonuses: { atk: 10, mp: 15 }, cost: 4, requires: 'rk_06' },
      { id: 'rk_08', name: '魔剣の蓄積', type: 'stat', description: 'ATK +10 / MP +18', bonuses: { atk: 10, mp: 18 }, cost: 4, requires: 'rk_07' },
      { id: 'rk_09', name: 'ルーン付与', type: 'skill', skillId: 'rk_skill_01', description: 'バトル終了までATK×4.0バフ・被ダメ×1.5（重複不可 / MP:80）', mpCost: 80, bonuses: {}, cost: 4, requires: 'rk_08' },
      { id: 'rk_10', name: 'ルーン強撃', type: 'skill', skillId: 'rk_skill_02', description: 'ATK×4.0ダメージ＋50%で敵DEF3ターン0＋会心率+50%（MP:70）', mpCost: 70, bonuses: {}, cost: 4, requires: 'rk_09' },
      { id: 'rk_11', name: '深淵の魔力', type: 'stat', description: 'ATK +14 / MP +20', bonuses: { atk: 14, mp: 20 }, cost: 5, requires: 'rk_10' },
      // パッシブ②：魔力凝縮スキルを上書き
      { id: 'rk_12', name: 'ルーンの奥義', type: 'passive', description: 'パッシブ：ルーン付与発動中、全スキルの攻撃倍率が1.2倍になる。「魔力凝縮」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'magic_condense', requires: 'rk_11' },
      { id: 'rk_13', name: '究極の剣技', type: 'stat', description: 'ATK +15 / MP +20', bonuses: { atk: 15, mp: 20 }, cost: 5, requires: 'rk_12' },
      { id: 'rk_14', name: 'ルーン爆裂斬', type: 'skill', skillId: 'rk_skill_03', description: '1撃目ATK×4.0＋2撃目ATK×2.5（50%で次ターン敵ATK×0.5デバフ）（MP:80）', mpCost: 80, bonuses: {}, cost: 5, requires: 'rk_13' },
      // パッシブ③：魔剣強撃スキルを上書き
      { id: 'rk_15', name: '魔法剣の覚醒', type: 'passive', description: 'パッシブ：ルーン付与発動中の通常攻撃が防御無視になる。「魔剣強撃」スキルを上書き。', bonuses: {}, cost: 6, overridesSkillId: 'magic_sword_strike', requires: 'rk_14' },
      { id: 'rk_16', name: 'ルーンの海', type: 'stat', description: 'ATK +15 / MP +30', bonuses: { atk: 15, mp: 30 }, cost: 5, requires: 'rk_15' },
      { id: 'rk_17', name: 'ルーンストライク', type: 'skill', skillId: 'rk_skill_04', description: 'ATK×2.4の3連撃（1撃30%でATK×1.3バフ永続・2撃30%で敵DEF×0.6・3撃15%でスタン）（MP:90）', mpCost: 90, bonuses: {}, cost: 5, requires: 'rk_16' },
      { id: 'rk_18', name: '魔剣士の至境', type: 'stat', description: 'ATK +18 / MP +25', bonuses: { atk: 18, mp: 25 }, cost: 5, requires: 'rk_17' },
      { id: 'rk_19', name: 'ルーン解放', type: 'skill', skillId: 'rk_skill_05', description: 'バトル中消費MP×2の代わりにスキル効果×2（攻撃倍率・デバフ・バフ発動確率 / バトル中1回 / MP:250）', mpCost: 250, bonuses: {}, cost: 6, requires: 'rk_18' },
      { id: 'rk_20', name: '無限のルーン', type: 'stat', description: 'ATK +20 / MP +35', bonuses: { atk: 20, mp: 35 }, cost: 6, requires: 'rk_19' },
      { id: 'rk_21', name: 'ルーンナイトの至高', type: 'stat', description: 'ATK +22 / MP +40', bonuses: { atk: 22, mp: 40 }, cost: 6, requires: 'rk_20' },
      // 最終奥義
      { id: 'rk_22', name: 'ルーンカタクリズム', type: 'skill', skillId: 'rk_skill_06', description: '自身次ターンATK・DEF×0.5＋ATK×4.0の5連撃＋バトル中敵DEF永続0（MP:300）', mpCost: 300, bonuses: {}, cost: 9, requires: 'rk_21' },
    ],
  },
];

/**
 * スキル定義テーブル（スキルツリーのスキルマスから収集）
 * showSkillPanel() や useSkill() で使用する
 */
const SKILL_DEFINITIONS = (() => {
  const defs = [];
  SKILL_TREE_DEFINITIONS.forEach(route => {
    route.nodes
      .filter(n => n.type === 'skill')
      .forEach(n => {
        defs.push({
          id:          n.skillId,
          name:        n.name,
          mpCost:      n.mpCost || 0,
          description: n.description,
          route:       route.id,
        });
      });
  });
  return defs;
})();

/**
 * 魔剣士ルートの解放条件を満たしているか判定する
 * 条件: アンロック済み AND 全4ルート（剣士・魔法・僧侶・戦士）の全ノードを取得済み AND 魔剣士の書を入手済み
 * @returns {boolean}
 */
function isMakenshiUnlocked() {
  const p = game.player;
  return !!p.permanentItems.makenshiRouteUnlocked && isMakenshiPrerequisiteMet();
}

/**
 * 魔剣士ルートの解放前提条件（全4ルートMAX＋魔剣士の書）を満たしているか判定する。
 * アンロック済みかどうかは含まない。
 * @returns {boolean}
 */
function isMakenshiPrerequisiteMet() {
  const p = game.player;
  if (!p.permanentItems.hasBookMakenshi) return false;
  const baseRoutes = ['swordsman', 'mage', 'cleric', 'warrior'];
  for (const routeId of baseRoutes) {
    const route = SKILL_TREE_DEFINITIONS.find(r => r.id === routeId);
    if (!route) return false;
    const acquired = p.skillTreeNodes[routeId] || [];
    if (acquired.length < route.nodes.length) return false;
  }
  return true;
}

/**
 * 魔剣士ルートをスキルストーン1個消費してアンロックする
 */
function unlockMakenshiRoute() {
  const p = game.player;
  const SKILL_STONE_NAME = 'スキルストーン';
  const stoneCount = p.materials[SKILL_STONE_NAME] || 0;

  if (stoneCount < 1) {
    alert('スキルストーンが足りません！');
    return;
  }

  if (!confirm('スキルストーンを1つ消費して魔剣士ルートをアンロックしますか？\n※ 他の職業のスキルツリーは消去され、SPが返還されます。')) {
    return;
  }

  // 他の全職業をリセット＋アンロックフラグを削除（常に1職業のみ保持）
  JOB_IDS.forEach(otherId => {
    const refund = resetJobSkillTree(otherId);
    if (refund > 0) {
      log(`🔄 ${otherId}ルートをリセットしました。SP +${refund} 返還。`, 'system');
    }
    delete p.permanentItems[getJobUnlockFlag(otherId)];
  });

  // スキルストーンを1消費
  p.materials[SKILL_STONE_NAME] -= 1;
  if (p.materials[SKILL_STONE_NAME] <= 0) {
    delete p.materials[SKILL_STONE_NAME];
  }

  // アンロックフラグを立てる
  p.permanentItems[getJobUnlockFlag('makenshi')] = true;

  // 現在の職業を設定
  p.currentJob = 'makenshi';

  // ステータス再計算
  p.recalcStats();

  // 画面再描画
  renderSkillTree();
  renderLobbyStatus();

  alert('✨ 魔剣士ルートが解放されました！');

  // 自動セーブ
  autoSave();
}

/** 上級職のジョブID一覧 */
var JOB_IDS = ['paladin', 'assassin', 'sage', 'berserker'];

/**
 * 新規4職業の共通解放前提条件を確認する（全4基本ルートMAX済み）
 * @returns {boolean}
 */
function isJobBasePrerequisiteMet() {
  const baseRoutes = ['swordsman', 'mage', 'cleric', 'warrior'];
  for (const routeId of baseRoutes) {
    const route = SKILL_TREE_DEFINITIONS.find(r => r.id === routeId);
    if (!route) return false;
    const acquired = game.player.skillTreeNodes[routeId] || [];
    if (acquired.length < route.nodes.length) return false;
  }
  return true;
}

/**
 * 指定職業のアンロック済みフラグ名を返す
 */
function getJobUnlockFlag(jobId) {
  return `${jobId}RouteUnlocked`;
}

/**
 * 指定職業が解放済みかを判定する
 */
function isJobUnlocked(jobId) {
  return !!game.player.permanentItems[getJobUnlockFlag(jobId)];
}

/**
 * 指定職業の書フラグ名を返す
 */
function getJobBookFlag(jobId) {
  const map = {
    paladin:    'hasBookPaladin',
    assassin:   'hasBookAssassin',
    sage:       'hasBookSage',
    berserker:  'hasBookBerserker',
  };
  return map[jobId];
}

/**
 * 指定職業の解放前提条件（全4ルートMAX＋対応する書）を確認する
 */
function isJobPrerequisiteMet(jobId) {
  if (!isJobBasePrerequisiteMet()) return false;
  const bookFlag = getJobBookFlag(jobId);
  if (!bookFlag) return false;
  return !!game.player.permanentItems[bookFlag];
}

/**
 * 現在の職業スキルツリーをリセットし使用済みSPを返還する
 * @param {string} jobId - リセットするジョブID
 */
function resetJobSkillTree(jobId) {
  const p = game.player;
  const route = SKILL_TREE_DEFINITIONS.find(r => r.id === jobId);
  if (!route) return;

  const acquired = p.skillTreeNodes[jobId] || [];
  if (acquired.length === 0) return;

  // SP返還
  let spRefund = 0;
  acquired.forEach(nodeId => {
    const node = route.nodes.find(n => n.id === nodeId);
    if (node) spRefund += node.cost;
  });

  // スキルを learnedSkills から削除
  const jobSkillIds = route.nodes
    .filter(n => n.type === 'skill' && n.skillId)
    .map(n => n.skillId);
  p.learnedSkills = p.learnedSkills.filter(s => !jobSkillIds.includes(s));
  // お気に入りからも削除
  p.favoriteSkills = p.favoriteSkills.filter(s => !jobSkillIds.includes(s));

  // 特級職ルートリセット時：パッシブ②③が上書きした上級職スキルを復元する
  const eliteJobIdsList = ['crusader', 'phantom', 'oracle', 'catastrophe', 'rune_knight'];
  if (eliteJobIdsList.includes(jobId)) {
    acquired.forEach(nodeId => {
      const node = route.nodes.find(n => n.id === nodeId);
      if (node && node.type === 'passive' && node.overridesSkillId) {
        // 上書きされた上級職スキルを復元（まだlearnedSkillsにない場合のみ）
        if (!p.learnedSkills.includes(node.overridesSkillId)) {
          p.learnedSkills.push(node.overridesSkillId);
        }
      }
    });
  }

  // ノードをクリア
  p.skillTreeNodes[jobId] = [];

  // 魔剣士ルートリセット時はシナジーフラグを削除
  if (jobId === 'makenshi' && p.permanentItems) {
    delete p.permanentItems.hasMakenshiSynergy;
  }

  // 上級職リセット時は紐づく特級職もリセットする
  const advancedToEliteJob = {
    paladin:    'crusader',
    assassin:   'phantom',
    sage:       'oracle',
    berserker:  'catastrophe',
    makenshi:   'rune_knight',
  };
  const linkedEliteId = advancedToEliteJob[jobId];
  if (linkedEliteId) {
    const eliteRoute    = SKILL_TREE_DEFINITIONS.find(r => r.id === linkedEliteId);
    const eliteAcquired = p.skillTreeNodes[linkedEliteId] || [];
    if (eliteRoute && eliteAcquired.length > 0) {
      // SP返還
      eliteAcquired.forEach(nodeId => {
        const node = eliteRoute.nodes.find(n => n.id === nodeId);
        if (node) spRefund += node.cost;
      });
      // スキルを learnedSkills / favoriteSkills から削除
      const eliteSkillIds = eliteRoute.nodes
        .filter(n => n.type === 'skill' && n.skillId)
        .map(n => n.skillId);
      p.learnedSkills   = p.learnedSkills.filter(s => !eliteSkillIds.includes(s));
      p.favoriteSkills  = p.favoriteSkills.filter(s => !eliteSkillIds.includes(s));

      // 特級職パッシブ②③が上書きした上級職スキルを復元する
      eliteAcquired.forEach(nodeId => {
        const node = eliteRoute.nodes.find(n => n.id === nodeId);
        if (node && node.type === 'passive' && node.overridesSkillId) {
          if (!p.learnedSkills.includes(node.overridesSkillId)) {
            p.learnedSkills.push(node.overridesSkillId);
          }
        }
      });
    }
    // ノードをクリア
    p.skillTreeNodes[linkedEliteId] = [];
    // 特級職に就いていた場合はcurrentJobをnullにリセット
    if (p.currentJob === linkedEliteId) {
      p.currentJob = null;
    }
  }

  // SP返還
  p.skillPoints += spRefund;

  return spRefund;
}

/**
 * 新規職業をアンロックする共通処理
 * @param {string} jobId - アンロックするジョブID
 */
function unlockJobRoute(jobId) {
  const p = game.player;
  const SKILL_STONE_NAME = 'スキルストーン';
  const stoneCount = p.materials[SKILL_STONE_NAME] || 0;

  if (stoneCount < 1) {
    alert('スキルストーンが足りません！');
    return;
  }

  const jobNames = { paladin: '聖騎士', assassin: '暗殺者', sage: '賢者', berserker: '狂戦士' };
  const jobName = jobNames[jobId] || jobId;
  const bookFlag = getJobBookFlag(jobId);
  const unlockFlag = getJobUnlockFlag(jobId);

  if (!confirm(`スキルストーンを1つ消費して${jobName}ルートをアンロックしますか？\n※ 他の職業のスキルツリーは消去され、SPが返還されます。`)) {
    return;
  }

  // 他の全職業をリセット＋アンロックフラグを削除（常に1職業のみ保持）
  JOB_IDS.forEach(otherId => {
    if (otherId === jobId) return;
    const refund = resetJobSkillTree(otherId);
    if (refund > 0) {
      log(`🔄 ${otherId}ルートをリセットしました。SP +${refund} 返還。`, 'system');
    }
    delete p.permanentItems[getJobUnlockFlag(otherId)];
  });
  // makenshiルートもリセット＋アンロックフラグを削除
  const makenshiRefund = resetJobSkillTree('makenshi');
  if (makenshiRefund > 0) {
    log(`🔄 makenshiルートをリセットしました。SP +${makenshiRefund} 返還。`, 'system');
  }
  delete p.permanentItems[getJobUnlockFlag('makenshi')];

  // スキルストーンを1消費
  p.materials[SKILL_STONE_NAME] -= 1;
  if (p.materials[SKILL_STONE_NAME] <= 0) {
    delete p.materials[SKILL_STONE_NAME];
  }

  // 書が未消費の場合は消費してフラグを立てる
  if (bookFlag && p.permanentItems[bookFlag] && !p.usedBooks[bookFlag]) {
    p.usedBooks[bookFlag] = true;
  }

  // 職業アンロックフラグを立てる
  p.permanentItems[unlockFlag] = true;

  // 現在の職業を設定
  p.currentJob = jobId;

  // ステータス再計算
  p.recalcStats();

  // 画面再描画
  renderSkillTree();
  renderLobbyStatus();

  alert(`✨ ${jobName}ルートが解放されました！`);

  // 自動セーブ
  autoSave();
}

/**
 * 特級職への転職処理
 * @param {string} jobId - 特級職のジョブID（crusader / phantom / oracle / catastrophe / rune_knight）
 */
function unlockEliteJobRoute(jobId) {
  const p = game.player;
  const SKILL_STONE_NAME = 'スキルストーン';
  const REQUIRED_STONES = 10;

  // 特級職名マップ
  const eliteJobNames = {
    crusader:    'クルセイダー',
    phantom:     'ファントム',
    oracle:      'オラクル',
    catastrophe: 'カタストロフ',
    rune_knight: 'ルーンナイト',
  };

  // 特級職の書フラグマップ
  const eliteBookFlags = {
    crusader:    'hasBookCrusader',
    phantom:     'hasBookPhantom',
    oracle:      'hasBookOracle',
    catastrophe: 'hasBookCatastrophe',
    rune_knight: 'hasBookRuneKnight',
  };

  // 特級職の昇格元（上級職）マップ
  const eliteSourceJobs = {
    crusader:    'paladin',
    phantom:     'assassin',
    oracle:      'sage',
    catastrophe: 'berserker',
    rune_knight: 'makenshi',
  };

  const jobName   = eliteJobNames[jobId]   || jobId;
  const bookFlag  = eliteBookFlags[jobId];
  const sourceJob = eliteSourceJobs[jobId];

  // 1. 対応する書の所持チェック
  if (!bookFlag || !p.permanentItems[bookFlag]) {
    alert('スキルの書が必要です');
    return;
  }

  // 2. Lv100以上チェック
  if (p.level < 100) {
    alert('Lv100以上が必要です');
    return;
  }

  // 3. スキルストーン10個チェック
  const stoneCount = p.materials[SKILL_STONE_NAME] || 0;
  if (stoneCount < REQUIRED_STONES) {
    alert('スキルストーンが10個必要です');
    return;
  }

  // 4. 対応する上級職に就いているか確認
  if (p.currentJob !== sourceJob) {
    alert('対応する上級職に就いている必要があります');
    return;
  }

  // 5. スキルストーンを10個消費
  p.materials[SKILL_STONE_NAME] -= REQUIRED_STONES;
  if (p.materials[SKILL_STONE_NAME] <= 0) {
    delete p.materials[SKILL_STONE_NAME];
  }

  // 6. 書を消費済みにする
  p.usedBooks[bookFlag] = true;

  // 7. 特級職をセット
  p.currentJob = jobId;

  // 8. ステータス再計算
  p.recalcStats();

  // 9. ログに就職メッセージを表示
  log(`✨ 特級職${jobName}に就職しました！`, 'system');

  // 画面再描画
  renderSkillTree();
  renderLobbyStatus();

  // 自動セーブ
  autoSave();
}

/* ==============================================================
   EXP 加算・レベルアップ処理
   ============================================================== */

/**
 * EXP を加算してレベルアップを処理する
 * スキルポイント付与:
 *   Lv2〜20:   5の倍数レベルは5pt、それ以外は3pt（合計65pt）
 *   Lv21〜50:  5の倍数レベルは5pt、それ以外は4pt（合計126pt）
 *   Lv51〜99:  5の倍数レベルは5pt、それ以外は0pt（合計45pt）
 *   Lv100〜500: 10の倍数レベルのみ5pt（合計205pt）
 *   Lv1〜500 総計: 441pt（5ルート合計235ptに対して余裕あり）
 * レベルアップ時のステータス成長:
 *   Lv2〜50:   ATK+1 / DEF+1 / HP+5 / MP+3
 *   Lv51〜99:  ATK+1 / DEF+1 / HP+3 / MP+2
 *   Lv100〜149: ATK+2 / DEF+2 / HP+5 / MP+3
 *   Lv150〜500: ATK+2 / DEF+2 / HP+7 / MP+4
 * @param {number} expGained - 獲得 EXP 量
 */
function gainExp(expGained) {
  const player = game.player;
  if (player.level >= MAX_LEVEL) {
    log(`EXP +${expGained}（レベル上限）`, 'result');
    return;
  }

  player.exp += expGained;

  // 連続レベルアップを処理する
  while (player.level < MAX_LEVEL && player.exp >= EXP_TABLE[player.level]) {
    player.level++;

    // レベルアップによる自然成長
    if (player.level <= 50) {
      player.attackBase  += 1;
      player.defenseBase += 1;
      player.maxHpBase   += 5;
      player.maxMpBase   += 3;
    } else if (player.level <= 99) {
      player.attackBase  += 1;
      player.defenseBase += 1;
      player.maxHpBase   += 3;
      player.maxMpBase   += 2;
    } else if (player.level <= 149) {
      player.attackBase  += 2;
      player.defenseBase += 2;
      player.maxHpBase   += 5;
      player.maxMpBase   += 3;
    } else {
      player.attackBase  += 2;
      player.defenseBase += 2;
      player.maxHpBase   += 7;
      player.maxMpBase   += 4;
    }

    // スキルポイント付与
    // Lv2〜50: 5の倍数は5pt、Lv21〜50の非5倍数は4pt、Lv20以下の非5倍数は3pt
    // Lv51〜99: 5の倍数は5pt、それ以外は0pt
    // Lv100〜500: 10の倍数のみ5pt、それ以外は0pt
    //   ※ Lv100〜300での合計：Lv100,110,...,300 → 21回 × 5pt = 105pt（特級職1ルート分）
    let pointsGained;
    if (player.level > 99) {
      pointsGained = (player.level % 10 === 0) ? 5 : 0;
    } else if (player.level % 5 === 0) {
      pointsGained = 5;
    } else if (player.level > 50) {
      pointsGained = 0;
    } else if (player.level > 20) {
      pointsGained = 4;
    } else {
      pointsGained = 3;
    }
    player.skillPoints += pointsGained;

    const spMsg = pointsGained > 0
      ? `スキルポイントを ${pointsGained}pt 獲得！`
      : 'スキルポイントなし';
    log(`⬆ レベルが ${player.level} に上がった！${spMsg}`, 'special');

    // ステータス再計算（装備含む）
    player.recalcStats();
    // HP / MP を最大値まで回復（レベルアップボーナス）
    // 狂血斧装備中はHP回復不可のため現在HPはそのまま保持する
    if (!Object.values(player.equipment).includes('kyouketsu_no_ono')) {
      player.hp = player.maxHp;
    }
    player.mp = player.maxMp;
  }

  renderPlayerStatus();
}

/**
 * 次のレベルまでの残り EXP を返す
 * @returns {number}
 */
function expToNextLevel() {
  const player = game.player;
  if (player.level >= MAX_LEVEL) return 0;
  return EXP_TABLE[player.level] - player.exp;
}

/* ==============================================================
   スキルツリー画面の描画
   ============================================================== */

/** 現在表示中のルートタブ */
let skillTreeCurrentRoute = 'swordsman';

/** 現在表示中のパート（1: 基本4ルート, 2: 上位職ルート） */
let skillTreeCurrentPart = 1;

/**
 * スキルツリーのパートタブ（Part1 / Part2 / Part3）を切り替える
 * @param {number} part - 1, 2, または 3
 */
function switchSkillTreePart(part) {
  skillTreeCurrentPart = part;

  // パートに応じてデフォルトルートを変更する
  if (part === 1) {
    skillTreeCurrentRoute = 'swordsman';
  } else if (part === 2) {
    skillTreeCurrentRoute = 'makenshi';
  } else if (part === 3) {
    // 現在の特級職 or 対応する特級職をデフォルトとして選択する
    const p = game.player;
    const parentToElite = {
      paladin:    'crusader',
      assassin:   'phantom',
      sage:       'oracle',
      berserker:  'catastrophe',
      makenshi:   'rune_knight',
    };
    const eliteIds = ['crusader', 'phantom', 'oracle', 'catastrophe', 'rune_knight'];
    if (eliteIds.includes(p.currentJob)) {
      skillTreeCurrentRoute = p.currentJob;
    } else if (parentToElite[p.currentJob]) {
      skillTreeCurrentRoute = parentToElite[p.currentJob];
    } else {
      skillTreeCurrentRoute = 'crusader';
    }
  }

  renderSkillTree();
}

/** スキルツリー画面を描画する */
function renderSkillTree() {
  const p = game.player;

  // 特級職・上級職の定数
  const ELITE_JOB_IDS     = ['crusader', 'phantom', 'oracle', 'catastrophe', 'rune_knight'];
  const ADVANCED_JOB_IDS  = ['paladin', 'assassin', 'sage', 'berserker', 'makenshi'];
  const ELITE_TO_PARENT   = {
    crusader:    'paladin',
    phantom:     'assassin',
    oracle:      'sage',
    catastrophe: 'berserker',
    rune_knight: 'makenshi',
  };
  const ELITE_NAMES = {
    crusader:    'クルセイダー',
    phantom:     'ファントム',
    oracle:      'オラクル',
    catastrophe: 'カタストロフ',
    rune_knight: 'ルーンナイト',
  };
  const ELITE_BOOK_FLAGS = {
    crusader:    'hasBookCrusader',
    phantom:     'hasBookPhantom',
    oracle:      'hasBookOracle',
    catastrophe: 'hasBookCatastrophe',
    rune_knight: 'hasBookRuneKnight',
  };
  // 上級職名マップ（特級職ロック表示でも参照する）
  const JOB_NAMES_MAP = {
    paladin: '聖騎士', assassin: '暗殺者', sage: '賢者', berserker: '狂戦士', makenshi: '魔剣士',
  };

  // 残りポイント表示
  const remaining = document.getElementById('st-remaining');
  if (remaining) remaining.textContent = `残りポイント: ${p.skillPoints} pt`;

  // Part3 タブの表示/非表示（上級職または特級職に就いている場合のみ表示）
  const isAdvancedOrElite = ADVANCED_JOB_IDS.includes(p.currentJob) || ELITE_JOB_IDS.includes(p.currentJob);
  const partBtn3 = document.getElementById('st-part-btn-3');
  if (partBtn3) {
    partBtn3.style.display = isAdvancedOrElite ? '' : 'none';
  }

  // Part1/Part2/Part3 ボタンのアクティブ状態を更新する
  const partBtn1 = document.getElementById('st-part-btn-1');
  const partBtn2 = document.getElementById('st-part-btn-2');
  if (partBtn1) partBtn1.classList.toggle('active', skillTreeCurrentPart === 1);
  if (partBtn2) partBtn2.classList.toggle('active', skillTreeCurrentPart === 2);
  if (partBtn3) partBtn3.classList.toggle('active', skillTreeCurrentPart === 3);

  // パートに応じてルートタブを切り替える
  const tabsPart1 = document.getElementById('st-tabs-part1');
  const tabsPart2 = document.getElementById('st-tabs-part2');
  const tabsPart3 = document.getElementById('st-tabs-part3');
  if (tabsPart1) tabsPart1.style.display = skillTreeCurrentPart === 1 ? '' : 'none';
  if (tabsPart2) tabsPart2.style.display = skillTreeCurrentPart === 2 ? '' : 'none';
  if (tabsPart3) tabsPart3.style.display = skillTreeCurrentPart === 3 ? '' : 'none';

  // タブのアクティブ状態を更新
  document.querySelectorAll('.st-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === skillTreeCurrentRoute);
  });

  // 魔剣士タブのロック/解放状態を反映する
  const makenshiUnlocked = isMakenshiUnlocked();
  const makenshiTabBtn = document.getElementById('st-tab-makenshi');
  if (makenshiTabBtn) {
    makenshiTabBtn.textContent = makenshiUnlocked ? '🗡 魔剣士' : '🔒 魔剣士';
    makenshiTabBtn.classList.toggle('tab-locked', !makenshiUnlocked);
  }

  // 4職業タブのロック/解放状態を更新する
  const jobTabConfig = [
    { id: 'paladin',   icon: '⚔',  label: '聖騎士' },
    { id: 'assassin',  icon: '🗡',  label: '暗殺者' },
    { id: 'sage',      icon: '📖', label: '賢者'   },
    { id: 'berserker', icon: '💢', label: '狂戦士' },
  ];
  jobTabConfig.forEach(({ id, icon, label }) => {
    const btn = document.getElementById(`st-tab-${id}`);
    if (!btn) return;
    const unlocked  = isJobUnlocked(id);
    const isCurrent = p.currentJob === id;
    if (isCurrent) {
      btn.textContent = `🌟 ${label}`;
      btn.classList.remove('tab-locked');
    } else {
      btn.textContent = unlocked ? `${icon} ${label}` : `🔒 ${label}`;
      btn.classList.toggle('tab-locked', !unlocked);
    }
  });

  // 特級職タブのロック/解放状態を更新する
  const eliteTabConfig = [
    { id: 'crusader',    parent: 'paladin',   icon: '✝',  label: 'クルセイダー' },
    { id: 'phantom',     parent: 'assassin',  icon: '👻', label: 'ファントム'   },
    { id: 'oracle',      parent: 'sage',      icon: '🔮', label: 'オラクル'     },
    { id: 'catastrophe', parent: 'berserker', icon: '💥', label: 'カタストロフ' },
    { id: 'rune_knight', parent: 'makenshi',  icon: '⚡', label: 'ルーンナイト' },
  ];
  eliteTabConfig.forEach(({ id, parent, icon, label }) => {
    const btn = document.getElementById(`st-tab-${id}`);
    if (!btn) return;
    const isCurrent  = p.currentJob === id;
    const isParent   = p.currentJob === parent;
    if (isCurrent) {
      btn.textContent = `🌟 ${label}`;
      btn.classList.remove('tab-locked');
    } else if (isParent) {
      btn.textContent = `🔓 ${label}`;
      btn.classList.remove('tab-locked');
    } else {
      btn.textContent = `🔒 ${label}`;
      btn.classList.add('tab-locked');
    }
  });

  // 現在のルートを取得
  const route = SKILL_TREE_DEFINITIONS.find(r => r.id === skillTreeCurrentRoute);
  if (!route) return;

  // 魔剣士タブが選択されているが未解放の場合はロックメッセージを表示する
  if (skillTreeCurrentRoute === 'makenshi' && !makenshiUnlocked) {
    const descEl = document.getElementById('st-route-desc');
    if (descEl) descEl.textContent = '';
    const nodeList = document.getElementById('st-node-list');
    if (nodeList) {
      const prereqMet = isMakenshiPrerequisiteMet();
      if (prereqMet) {
        // 条件達成済み：アンロックボタンを表示
        const stoneCount = p.materials['スキルストーン'] || 0;
        nodeList.innerHTML = `
          <div class="st-locked-msg">
            <div class="st-locked-icon">🔓</div>
            <div class="st-locked-title">魔剣士ルートを解放できます！</div>
            <div class="st-locked-cond">解放条件：</div>
            <ul class="st-locked-list">
              <li>✅ 全4ルート（剣士・魔法・僧侶・戦士）の全ノードを取得済み</li>
              <li>✅ 「魔剣士の書」を入手済み</li>
            </ul>
            <div class="st-locked-cond">スキルストーン所持数: ${stoneCount} 個</div>
            <button class="st-unlock-btn" onclick="unlockMakenshiRoute()" ${stoneCount < 1 ? 'disabled' : ''}>
              🔓 アンロックする（スキルストーン×1消費）
            </button>
          </div>`;
      } else {
        // 条件未達成：通常のロックメッセージを表示
        nodeList.innerHTML = `
          <div class="st-locked-msg">
            <div class="st-locked-icon">🔒</div>
            <div class="st-locked-title">魔剣士ルートは未解放です</div>
            <div class="st-locked-cond">解放条件：</div>
            <ul class="st-locked-list">
              <li>全4ルート（剣士・魔法・僧侶・戦士）の全ノードを取得済み</li>
              <li>「魔剣士の書」を入手済み（ガチャで入手可能）</li>
            </ul>
          </div>`;
      }
    }
    return;
  }

  // 4職業のロック表示
  const newJobs = ['paladin', 'assassin', 'sage', 'berserker'];
  const jobNames4 = JOB_NAMES_MAP;
  const jobBookNames = { paladin: '聖騎士の書', assassin: '暗殺者の書', sage: '賢者の書', berserker: '狂戦士の書' };
  if (newJobs.includes(skillTreeCurrentRoute)) {
    const jobId    = skillTreeCurrentRoute;
    const jobName  = jobNames4[jobId];
    const bookName = jobBookNames[jobId];
    const descEl2  = document.getElementById('st-route-desc');
    const nodeList2 = document.getElementById('st-node-list');

    // 現在の職業でない場合（未解放・または別職業が有効）
    if (p.currentJob !== jobId) {
      if (descEl2) descEl2.textContent = '';
      if (nodeList2) {
        const jobUnlocked = isJobUnlocked(jobId);
        const prereqMet   = isJobPrerequisiteMet(jobId);
        const stoneCount  = p.materials['スキルストーン'] || 0;

        if (jobUnlocked) {
          // 解放済みだが現在の職業でない → 職業変更ボタンを表示
          nodeList2.innerHTML = `
            <div class="st-locked-msg">
              <div class="st-locked-icon">🔄</div>
              <div class="st-locked-title">${jobName}は解放済みです（現在の職業: ${p.currentJob ? jobNames4[p.currentJob] || p.currentJob : 'なし'}）</div>
              <div class="st-locked-cond">この職業に切り替えるにはスキルストーンが必要です。</div>
              <div class="st-locked-cond">スキルストーン所持数: ${stoneCount} 個</div>
              <button class="st-unlock-btn" onclick="unlockJobRoute('${jobId}')" ${stoneCount < 1 ? 'disabled' : ''}>
                🔄 ${jobName}に職業変更する（スキルストーン×1消費）
              </button>
            </div>`;
        } else if (prereqMet) {
          // 条件達成済み：アンロックボタンを表示
          nodeList2.innerHTML = `
            <div class="st-locked-msg">
              <div class="st-locked-icon">🔓</div>
              <div class="st-locked-title">${jobName}ルートを解放できます！</div>
              <div class="st-locked-cond">解放条件：</div>
              <ul class="st-locked-list">
                <li>✅ 全4ルート（剣士・魔法・僧侶・戦士）の全ノードを取得済み</li>
                <li>✅ 「${bookName}」を入手済み</li>
              </ul>
              <div class="st-locked-cond">スキルストーン所持数: ${stoneCount} 個</div>
              <button class="st-unlock-btn" onclick="unlockJobRoute('${jobId}')" ${stoneCount < 1 ? 'disabled' : ''}>
                🔓 アンロックする（スキルストーン×1消費）
              </button>
            </div>`;
        } else {
          // 条件未達成：通常のロックメッセージを表示
          nodeList2.innerHTML = `
            <div class="st-locked-msg">
              <div class="st-locked-icon">🔒</div>
              <div class="st-locked-title">${jobName}ルートは未解放です</div>
              <div class="st-locked-cond">解放条件：</div>
              <ul class="st-locked-list">
                <li>全4ルート（剣士・魔法・僧侶・戦士）の全ノードを取得済み</li>
                <li>「${bookName}」を入手済み（ガチャで入手可能）</li>
              </ul>
            </div>`;
        }
      }
      return;
    }
  }

  // 特級職ルートの表示処理
  if (ELITE_JOB_IDS.includes(skillTreeCurrentRoute)) {
    const eliteId   = skillTreeCurrentRoute;
    const parentId  = ELITE_TO_PARENT[eliteId];
    const eliteName = ELITE_NAMES[eliteId];
    const bookFlag  = ELITE_BOOK_FLAGS[eliteId];
    const descElE   = document.getElementById('st-route-desc');
    const nodeListE = document.getElementById('st-node-list');

    if (p.currentJob !== eliteId) {
      // 特級職に就いていない場合
      if (descElE) descElE.textContent = '';
      if (nodeListE) {
        if (p.currentJob === parentId) {
          // 対応する上級職就任中：閲覧モード + 昇格ボタン
          const stoneCount = p.materials['スキルストーン'] || 0;
          const hasBook    = !!p.permanentItems[bookFlag];
          const hasLevel   = p.level >= 100;
          const canPromote = hasLevel && hasBook && stoneCount >= 10;
          const condHtml = `
            <ul class="st-locked-list">
              <li>${hasLevel   ? '✅' : '❌'} Lv100以上（現在 Lv${p.level}）</li>
              <li>${hasBook    ? '✅' : '❌'} 「${eliteName}の書」を入手済み</li>
              <li>${stoneCount >= 10 ? '✅' : '❌'} スキルストーン×10所持（現在: ${stoneCount}個）</li>
            </ul>
            <button class="st-unlock-btn" onclick="unlockEliteJobRoute('${eliteId}')" ${canPromote ? '' : 'disabled'}>
              ✨ ${eliteName}に昇格する（スキルストーン×10消費）
            </button>`;
          // 閲覧用ノードHTMLを生成（disabled）。上級職の取得済みノード数を渡して進捗を表示。
          const parentAcquiredCount = (p.skillTreeNodes[parentId] || []).length;
          const previewHtml = buildNodeListHtml(eliteId, true, parentAcquiredCount);
          nodeListE.innerHTML = `
            <div class="st-locked-msg">
              <div class="st-locked-title">🔓 ${eliteName}ルート（閲覧モード）</div>
              <div class="st-locked-cond">特級職に就職すると解放されます</div>
              <div class="st-locked-cond">昇格条件：</div>
              ${condHtml}
            </div>
            <div class="st-elite-preview">${previewHtml}</div>`;
        } else {
          // 別の職業に就いている → ロックメッセージ
          const advancedName = JOB_NAMES_MAP[parentId] || parentId;
          nodeListE.innerHTML = `
            <div class="st-locked-msg">
              <div class="st-locked-icon">🔒</div>
              <div class="st-locked-title">${eliteName}ルートは未解放です</div>
              <div class="st-locked-cond">${advancedName}に就職してから昇格できます</div>
            </div>`;
        }
      }
      return;
    }
  }

  // ルート説明
  const descEl = document.getElementById('st-route-desc');
  if (descEl) descEl.textContent = route.description;

  // ノードリストを描画
  const nodeList = document.getElementById('st-node-list');
  if (!nodeList) return;

  // 全解放ボタンのHTML生成
  const allUnlockBtnHtml = buildAllUnlockButtonHtml(skillTreeCurrentRoute);

  // ノードリストのHTML生成
  const nodesHtml = buildNodeListHtml(skillTreeCurrentRoute, false);

  nodeList.innerHTML = allUnlockBtnHtml + nodesHtml;
}

/**
 * ノードリストのHTMLを生成する
 * @param {string} routeId - ルートID
 * @param {boolean} previewMode - trueの場合はノード取得不可（閲覧のみ）
 * @param {number} [parentNodeCount=-1] - 上級職プレビュー時の上級職取得済みノード数（-1で無効）
 * @returns {string} HTML文字列
 */
function buildNodeListHtml(routeId, previewMode, parentNodeCount = -1) {
  const p = game.player;
  const route = SKILL_TREE_DEFINITIONS.find(r => r.id === routeId);
  if (!route) return '';

  const acquiredIds = p.skillTreeNodes[routeId] || [];

  return route.nodes.map((node, idx) => {
    const isAcquired   = acquiredIds.includes(node.id);
    const prevAcquired = !node.requires || acquiredIds.includes(node.requires);
    const canAfford    = p.skillPoints >= node.cost;

    let stateClass;
    if (isAcquired)        stateClass = 'acquired';
    else if (prevAcquired) stateClass = 'available';
    else                   stateClass = 'locked';

    const clickable   = !previewMode && !isAcquired && prevAcquired;
    const onclickAttr = clickable
      ? `onclick="acquireSkillNode('${routeId}', '${node.id}')"`
      : '';

    // パッシブノードは🔮アイコンで表示する
    const typeIcon = node.type === 'skill' ? '✨' : node.type === 'passive' ? '🔮' : '📈';

    let statusText;
    if (previewMode && !isAcquired) {
      if (parentNodeCount >= 0) {
        // 上級職就任中のプレビューモード：上級職ノード数に基づく解放進捗を表示
        const neededParentNodes = idx + 1;
        const remaining = neededParentNodes - parentNodeCount;
        if (remaining <= 0) {
          statusText = '✅ 上級職条件達成！昇格後に取得可能';
        } else {
          statusText = `🔒 あと${remaining}ノード上級職を進めると解放できます`;
        }
      } else {
        statusText = '🔒 特級職に就職すると解放されます';
      }
    } else if (isAcquired) {
      statusText = '✓ 取得済み';
    } else if (!prevAcquired) {
      statusText = '🔒 前のノードを取得してください';
    } else if (!canAfford) {
      statusText = `⚠ SP が足りません（必要 ${node.cost} pt）`;
    } else {
      statusText = `▶ クリックして取得（${node.cost} SP 消費）`;
    }

    const arrow = idx < route.nodes.length - 1 ? '<div class="st-node-arrow">↓</div>' : '';

    // スキルマスのみお気に入りボタンを表示する（プレビューモードでは非表示）
    let favoriteBtn = '';
    if (!previewMode && node.type === 'skill' && node.skillId) {
      const isFav = p.favoriteSkills.includes(node.skillId);
      favoriteBtn = `<button class="st-favorite-btn${isFav ? ' active' : ''}" onclick="event.stopPropagation(); toggleFavoriteSkill('${node.skillId}')" title="${isFav ? 'お気に入りを解除' : 'お気に入りに登録'}">${isFav ? '★' : '☆'}</button>`;
    }

    const previewClass = previewMode && !isAcquired ? ' st-node-preview' : '';

    return `
      <div class="st-node ${stateClass}${previewClass}" ${onclickAttr}>
        <div class="st-node-header">
          <span class="st-node-icon">${typeIcon}</span>
          <span class="st-node-name">${node.name}</span>
          <span class="st-node-cost">${node.cost} SP</span>
          ${favoriteBtn}
        </div>
        <div class="st-node-desc">${node.description}</div>
        <div class="st-node-status">${statusText}</div>
      </div>${arrow}`;
  }).join('');
}

/**
 * 全解放ボタンのHTMLを生成する
 * @param {string} routeId - ルートID
 * @returns {string} HTML文字列
 */
function buildAllUnlockButtonHtml(routeId) {
  const p = game.player;
  const route = SKILL_TREE_DEFINITIONS.find(r => r.id === routeId);
  if (!route) return '';

  const ELITE_JOB_IDS   = ['crusader', 'phantom', 'oracle', 'catastrophe', 'rune_knight'];
  const ELITE_TO_PARENT = {
    crusader:    'paladin',
    phantom:     'assassin',
    oracle:      'sage',
    catastrophe: 'berserker',
    rune_knight: 'makenshi',
  };

  const acquiredIds = p.skillTreeNodes[routeId] || [];

  // 取得可能なノードを requires 順に算出する
  const acquirable = [];
  const tempAcquired = [...acquiredIds];

  if (ELITE_JOB_IDS.includes(routeId)) {
    // 特級職：上級職ノード数による上限あり
    const parentId           = ELITE_TO_PARENT[routeId];
    const parentAcquiredCnt  = (p.skillTreeNodes[parentId] || []).length;
    const maxMoreElite       = parentAcquiredCnt - acquiredIds.length;
    let added = 0;
    for (const node of route.nodes) {
      if (added >= maxMoreElite) break;
      if (tempAcquired.includes(node.id)) continue;
      if (node.requires && !tempAcquired.includes(node.requires)) break;
      acquirable.push(node);
      tempAcquired.push(node.id);
      added++;
    }
  } else {
    // 通常ルート：requires 連鎖で取得可能なノードを全て列挙する
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of route.nodes) {
        if (tempAcquired.includes(node.id)) continue;
        if (node.requires && !tempAcquired.includes(node.requires)) continue;
        acquirable.push(node);
        tempAcquired.push(node.id);
        changed = true;
      }
    }
  }

  // 取得可能なノードがない場合はボタンを表示しない
  if (acquirable.length === 0) return '';

  const totalCost = acquirable.reduce((sum, n) => sum + n.cost, 0);
  const canAfford = p.skillPoints >= totalCost;

  return `
    <div class="st-all-unlock">
      <button class="st-all-unlock-btn" onclick="acquireAllSkillNodes('${routeId}')" ${canAfford ? '' : 'disabled'}>
        ${canAfford ? `🔓 全解放（${totalCost} SP消費）` : `🔒 SP不足（必要: ${totalCost} pt）`}
      </button>
    </div>`;
}

/**
 * スキルツリーのルートタブを切り替える
 * @param {string} routeId
 */
function switchSkillTreeTab(routeId) {
  skillTreeCurrentRoute = routeId;
  renderSkillTree();
}

/**
 * スキルのお気に入り登録・解除をトグルする
 * @param {string} skillId - スキル ID
 */
function toggleFavoriteSkill(skillId) {
  const p = game.player;
  const idx = p.favoriteSkills.indexOf(skillId);
  if (idx === -1) {
    p.favoriteSkills.push(skillId);
  } else {
    p.favoriteSkills.splice(idx, 1);
  }
  renderSkillTree();
}

/**
 * 指定ルートの取得可能なノードを全て解放する
 * @param {string} routeId - ルートID
 */
function acquireAllSkillNodes(routeId) {
  const p = game.player;
  const route = SKILL_TREE_DEFINITIONS.find(r => r.id === routeId);
  if (!route) return;

  const ELITE_JOB_IDS   = ['crusader', 'phantom', 'oracle', 'catastrophe', 'rune_knight'];
  const ELITE_TO_PARENT = {
    crusader:    'paladin',
    phantom:     'assassin',
    oracle:      'sage',
    catastrophe: 'berserker',
    rune_knight: 'makenshi',
  };

  const acquiredIds = p.skillTreeNodes[routeId] || [];

  // 取得可能なノードを requires 順に算出する
  const acquirable = [];
  const tempAcquired = [...acquiredIds];

  if (ELITE_JOB_IDS.includes(routeId)) {
    // 特級職：上級職ノード数による上限あり
    const parentId           = ELITE_TO_PARENT[routeId];
    const parentAcquiredCnt  = (p.skillTreeNodes[parentId] || []).length;
    const maxMoreElite       = parentAcquiredCnt - acquiredIds.length;
    let added = 0;
    for (const node of route.nodes) {
      if (added >= maxMoreElite) break;
      if (tempAcquired.includes(node.id)) continue;
      if (node.requires && !tempAcquired.includes(node.requires)) break;
      acquirable.push(node);
      tempAcquired.push(node.id);
      added++;
    }
  } else {
    // 通常ルート：requires 連鎖で取得可能なノードを全て列挙する
    let changed = true;
    while (changed) {
      changed = false;
      for (const node of route.nodes) {
        if (tempAcquired.includes(node.id)) continue;
        if (node.requires && !tempAcquired.includes(node.requires)) continue;
        acquirable.push(node);
        tempAcquired.push(node.id);
        changed = true;
      }
    }
  }

  if (acquirable.length === 0) return;

  const totalCost = acquirable.reduce((sum, n) => sum + n.cost, 0);
  if (p.skillPoints < totalCost) {
    alert('スキルポイントが足りません！');
    return;
  }

  if (!confirm('全ノードを解放しますか？')) return;

  // 初期化
  if (!p.skillTreeNodes[routeId]) p.skillTreeNodes[routeId] = [];

  for (const node of acquirable) {
    p.skillPoints -= node.cost;
    p.skillTreeNodes[routeId].push(node.id);

    // mk_01 取得時にシナジーフラグを設定
    if (routeId === 'makenshi' && node.id === 'mk_01') {
      if (!p.permanentItems) p.permanentItems = {};
      p.permanentItems.hasMakenshiSynergy = true;
    }

    // スキルマスの場合は learnedSkills に追加
    if (node.type === 'skill' && node.skillId) {
      if (!p.learnedSkills.includes(node.skillId)) {
        p.learnedSkills.push(node.skillId);
      }
    }

    // 特級職パッシブ②③：対応する上級職スキルIDをlearnedSkillsから削除（上書き）
    const eliteJobRoutesListAll = ['crusader', 'phantom', 'oracle', 'catastrophe', 'rune_knight'];
    if (eliteJobRoutesListAll.includes(routeId) && node.type === 'passive' && node.overridesSkillId) {
      p.learnedSkills  = p.learnedSkills.filter(s => s !== node.overridesSkillId);
      p.favoriteSkills = p.favoriteSkills.filter(s => s !== node.overridesSkillId);
    }
  }

  p.recalcStats();
  renderSkillTree();
  renderLobbyStatus();
}

/**
 * スキルツリーのノードを取得する
 * @param {string} routeId - ルート ID
 * @param {string} nodeId  - ノード ID
 */
function acquireSkillNode(routeId, nodeId) {
  const p = game.player;

  const route = SKILL_TREE_DEFINITIONS.find(r => r.id === routeId);
  if (!route) return;

  const node = route.nodes.find(n => n.id === nodeId);
  if (!node) return;

  // 魔剣士ルートは解放条件を満たしていないと取得不可
  if (routeId === 'makenshi' && !isMakenshiUnlocked()) return;

  // 4職業ルートは「現在の職業」でないとノード取得不可（排他制を保証する）
  const newJobRoutes = ['paladin', 'assassin', 'sage', 'berserker'];
  if (newJobRoutes.includes(routeId) && p.currentJob !== routeId) return;

  // 特級職ルートの制限チェック
  const eliteJobRoutes = ['crusader', 'phantom', 'oracle', 'catastrophe', 'rune_knight'];
  const eliteJobToParent = {
    crusader:    'paladin',
    phantom:     'assassin',
    oracle:      'sage',
    catastrophe: 'berserker',
    rune_knight: 'makenshi',
  };
  if (eliteJobRoutes.includes(routeId)) {
    // 特級職に就いていないとノード取得不可
    if (p.currentJob !== routeId) return;
    // 対応する上級職の取得済みノード数 >= 特級職の取得済みノード数 + 1 の条件チェック
    const parentJobId     = eliteJobToParent[routeId];
    const parentAcquired  = (p.skillTreeNodes[parentJobId] || []).length;
    const eliteAcquired   = (p.skillTreeNodes[routeId]    || []).length;
    if (parentAcquired < eliteAcquired + 1) {
      const needed = (eliteAcquired + 1) - parentAcquired;
      alert(`あと${needed}ノード上級職を進めると解放できます`);
      return;
    }
  }

  // 既に取得済みか確認
  if (!p.skillTreeNodes[routeId]) p.skillTreeNodes[routeId] = [];
  if (p.skillTreeNodes[routeId].includes(nodeId)) return;

  // 前のノードが取得されているか確認
  if (node.requires && !p.skillTreeNodes[routeId].includes(node.requires)) return;

  // SP が足りるか確認
  if (p.skillPoints < node.cost) {
    alert('スキルポイントが足りません！');
    return;
  }

  // ノードを取得
  p.skillPoints -= node.cost;
  p.skillTreeNodes[routeId].push(nodeId);

  // mk_01 取得時にシナジーフラグを設定
  if (routeId === 'makenshi' && nodeId === 'mk_01') {
    if (!p.permanentItems) p.permanentItems = {};
    p.permanentItems.hasMakenshiSynergy = true;
  }

  // スキルマスの場合は learnedSkills に追加
  if (node.type === 'skill' && node.skillId) {
    if (!p.learnedSkills.includes(node.skillId)) {
      p.learnedSkills.push(node.skillId);
    }
  }

  // 特級職パッシブ②③：対応する上級職スキルIDをlearnedSkillsから削除（上書き）
  const eliteJobRoutesList = ['crusader', 'phantom', 'oracle', 'catastrophe', 'rune_knight'];
  if (eliteJobRoutesList.includes(routeId) && node.type === 'passive' && node.overridesSkillId) {
    p.learnedSkills    = p.learnedSkills.filter(s => s !== node.overridesSkillId);
    p.favoriteSkills   = p.favoriteSkills.filter(s => s !== node.overridesSkillId);
  }

  // ステータス再計算
  p.recalcStats();

  // 画面を再描画
  renderSkillTree();
  renderLobbyStatus();
}

/* ==============================================================
   スキル使用（戦闘中に呼ばれる）
   ============================================================== */

/**
 * スキルを使用する
 * @param {string} skillId - 使用するスキル ID
 */
function useSkill(skillId) {
  if (game.state !== GameState.PLAYER_TURN) return;

  const skill = SKILL_DEFINITIONS.find(s => s.id === skillId);
  if (!skill) return;

  const player = game.player;
  const enemy  = game.enemy;

  if (player.mp < skill.mpCost) {
    log('⚠ MP が足りない！', 'system');
    return;
  }

  // HP消費スキルの使用条件チェック
  const hpInsufficient = (() => {
    switch (skillId) {
      case 'blood_price':        return player.hp <= 30;
      case 'self_harm_strike':   return player.hp / player.maxHp <= 0.20;
      case 'berserk_rampage':    return player.hp / player.maxHp <= 0.30;
      case 'annihilation_strike': return player.hp / player.maxHp <= 0.50;
      case 'ct_skill_01':        return player.hp <= 1;
      case 'ct_skill_07':        return player.hp <= 1;
      default: return false;
    }
  })();
  if (hpInsufficient) {
    log('⚠ HP が足りない！', 'system');
    return;
  }

  setButtonsEnabled(false);
  hideSkillPanel();

  player.mp -= skill.mpCost;
  applyMpRegenEffect();

  switch (skillId) {

    /* ── 剣士スキル ── */

    case 'iai_slash': {
      // 居合斬り: ATK×1.5 / 25%で防御を無視する会心
      const crit = Math.random() < 0.25;
      const defFactor = crit ? 0 : SKILL_DEFENSE_FACTOR;
      const raw = Math.floor(player.effectiveAttack * 1.5) - Math.floor(enemy.defense * defFactor);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      if (crit) {
        log(`⚔✨ ${player.name} は「居合斬り」で会心！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
      } else {
        log(`⚔ ${player.name} は「居合斬り」で斬り込んだ！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'chain_slash': {
      // 連続斬り: 3 回攻撃
      const dmg1 = player.calcAttackDamage(enemy);
      enemy.takeDamage(dmg1);
      let dmg2 = 0;
      if (enemy.isAlive()) {
        dmg2 = player.calcAttackDamage(enemy);
        enemy.takeDamage(dmg2);
      }
      let dmg3 = 0;
      if (enemy.isAlive()) {
        dmg3 = player.calcAttackDamage(enemy);
        enemy.takeDamage(dmg3);
      }
      log(`⚔⚔⚔ ${player.name} は「連続斬り」で 3 回攻撃！ → ${enemy.name} に ${dmg1}＋${dmg2}＋${dmg3} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'thunder_slash': {
      // 雷光斬り: ATK×2.0
      const raw = Math.floor(player.effectiveAttack * 2.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      log(`⚡ ${player.name} は「雷光斬り」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'death_blow': {
      // 必殺剣: ATK×2.5 / 防御完全無視
      const raw = Math.floor(player.effectiveAttack * 2.5);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 6)), 'deal');
      enemy.takeDamage(dmg);
      log(`💀 ${player.name} は「必殺剣」で防御を貫いた！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 魔法スキル ── */

    case 'fire': {
      // ファイア: ATK×1.6
      const raw = Math.floor(player.effectiveAttack * 1.6) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      log(`🔥 ${player.name} は「ファイア」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'thunder': {
      // サンダー: ATK×1.8
      const raw = Math.floor(player.effectiveAttack * 1.8) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      log(`⚡ ${player.name} は「サンダー」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'heal_magic': {
      // 治癒魔法: HP 回復（40 + Lv×3）
      const healAmt = 40 + player.level * 3;
      player.heal(healAmt);
      log(`💚 ${player.name} は「治癒魔法」を唱えた！ HP +${healAmt}`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'blizzard': {
      // ブリザド: ATK×2.2
      const raw = Math.floor(player.effectiveAttack * 2.2) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      log(`🌨 ${player.name} は「ブリザド」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'grand_magic': {
      // 大魔法陣: ATK×3.0
      const raw = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(dmg);
      log(`✨ ${player.name} は「大魔法陣」を展開した！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 僧侶スキル ── */

    case 'holy_light': {
      // ホーリーライト: HP 回復（30 + Lv×2）
      const healAmt = 30 + player.level * 2;
      player.heal(healAmt);
      log(`✨ ${player.name} は「ホーリーライト」を使った！ HP +${healAmt}`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'bless': {
      // 祝福: ATK +25 バフ 5 ターン
      game.playerAtkBuff = { bonus: 25, turnsLeft: 5 };
      log(`🌟 ${player.name} は「祝福」を唱えた！ 5 ターン ATK +25`, 'player-action');
      break;
    }

    case 'big_heal': {
      // 大回復: HP 回復（50 + Lv×3）
      const healAmt = 50 + player.level * 3;
      player.heal(healAmt);
      log(`💚 ${player.name} は「大回復」を唱えた！ HP +${healAmt}`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'sanctuary': {
      // 聖域: DEF +40 バフ 4 ターン
      game.shieldActive = game.shieldActive.filter(s => s.source !== 'sanctuary');
      game.shieldActive.push({ defenseBonus: 40, turnsLeft: 4, source: 'sanctuary', name: '聖域' });
      log(`🛡 ${player.name} は「聖域」を展開した！ 4 ターン DEF +40`, 'player-action');
      break;
    }

    case 'divine_heal': {
      // 神聖魔法: HP 回復（60 + Lv×4）
      const healAmt = 60 + player.level * 4;
      player.heal(healAmt);
      log(`🌟 ${player.name} は「神聖魔法」を唱えた！ HP +${healAmt}`, 'player-action');
      renderPlayerStatus();
      break;
    }

    /* ── 戦士スキル ── */

    case 'trip': {
      // 足払い: ATK×1.2 + 15%の確率でスタン＋常時ATK低下デバフ
      const raw = Math.floor(player.effectiveAttack * 1.2) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 3)), 'deal');
      enemy.takeDamage(dmg);
      const stunned = Math.random() < 0.15;
      game.enemyStunned = stunned;
      // 常時ATK低下デバフを付与（スタン有無にかかわらず）
      game.enemyAtkDebuff = { factor: 0.85, turnsLeft: 2 };
      if (stunned) {
        log(`💥 ${player.name} は「足払い」を決めた！ → ${enemy.name} に ${dmg} ダメージ！次のターン行動不能＋ATK低下！`, 'player-action');
      } else {
        log(`💥 ${player.name} は「足払い」を決めた！ → ${enemy.name} に ${dmg} ダメージ！ATK低下！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'intimidate': {
      // 威嚇: 敵 ATK ×0.55（3 ターン）- 大幅強化版
      game.enemyAtkDebuff = { factor: 0.55, turnsLeft: 3 };
      log(`😤 ${player.name} は「威嚇」した！ → ${enemy.name} の攻撃力が 3 ターン大幅低下！`, 'player-action');
      break;
    }

    case 'body_slam': {
      // 体当たり: ATK×1.6 + 20%の確率でスタン＋常時ATK大幅低下デバフ
      const raw = Math.floor(player.effectiveAttack * 1.6) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      const stunned = Math.random() < 0.20;
      game.enemyStunned = stunned;
      // 常時ATK大幅低下デバフを付与（スタン有無にかかわらず）
      game.enemyAtkDebuff = { factor: 0.80, turnsLeft: 3 };
      if (stunned) {
        log(`💥 ${player.name} は「体当たり」を仕掛けた！ → ${enemy.name} に ${dmg} ダメージ！スタン＋ATK大幅低下！`, 'player-action');
      } else {
        log(`💥 ${player.name} は「体当たり」を仕掛けた！ → ${enemy.name} に ${dmg} ダメージ！ATK大幅低下！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'devastating_blow': {
      // 破壊の一撃: ATK×2.0 + 敵 ATK デバフ（3 ターン・大幅強化版）
      const raw = Math.floor(player.effectiveAttack * 2.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      game.enemyAtkDebuff = { factor: 0.65, turnsLeft: 3 };
      log(`💢 ${player.name} は「破壊の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！攻撃力が 3 ターン大幅低下！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 剣士新スキル ── */

    case 'shooting_star': {
      // 流星斬り: ATK×1.3 の 2 連撃
      const raw1 = Math.floor(player.effectiveAttack * 1.3) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg1 = applyEquipmentEffects(Math.max(1, raw1 + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg1);
      let dmg2 = 0;
      if (enemy.isAlive()) {
        const raw2 = Math.floor(player.effectiveAttack * 1.3) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        dmg2 = applyEquipmentEffects(Math.max(1, raw2 + randInt(-2, 4)), 'deal');
        enemy.takeDamage(dmg2);
      }
      log(`🌠 ${player.name} は「流星斬り」で 2 連撃！ → ${enemy.name} に ${dmg1}＋${dmg2} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'ruin_slash': {
      // 崩壊斬り: ATK×3.0
      const raw = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(dmg);
      log(`⚔ ${player.name} は「崩壊斬り」を振りおろした！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'peerless_blade': {
      // 天地無用剣: ATK×1.4 の 3 連撃
      const hits = [];
      for (let i = 0; i < 3; i++) {
        if (!enemy.isAlive()) break;
        const raw = Math.floor(player.effectiveAttack * 1.4) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 6)), 'deal');
        enemy.takeDamage(dmg);
        hits.push(dmg);
      }
      log(`✴ ${player.name} は「天地無用剣」で 3 連撃！ → ${enemy.name} に ${hits.join('＋')} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 魔法新スキル ── */

    case 'meteor': {
      // メテオ: ATK×2.8
      const raw = Math.floor(player.effectiveAttack * 2.8) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(dmg);
      log(`☄ ${player.name} は「メテオ」を召喚した！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'magic_explosion': {
      // 魔力爆発: ATK×3.5
      const raw = Math.floor(player.effectiveAttack * 3.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 8)), 'deal');
      enemy.takeDamage(dmg);
      log(`💥 ${player.name} は「魔力爆発」を発動した！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'regen': {
      // リジェネ: 3ターン毎ターンHP回復 (+20/turn)
      game.playerRegen = game.playerRegen.filter(r => r.source !== 'regen');
      game.playerRegen.push({ hpPerTurn: 20 + Math.floor(player.level * 0.5), turnsLeft: 3, source: 'regen', preTurn: false });
      log(`💚 ${player.name} は「リジェネ」を唱えた！ 3 ターン HP 回復効果！`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'spacetime_magic': {
      // 時空魔法: ATK×5.0
      const raw = Math.floor(player.effectiveAttack * 5.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-6, 10)), 'deal');
      enemy.takeDamage(dmg);
      log(`🌀 ${player.name} は「時空魔法」を展開した！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 僧侶新スキル ── */

    case 'battle_hymn': {
      // 祝福の歌: ATK+40 バフ 6 ターン
      game.playerAtkBuff = { bonus: 40, turnsLeft: 6 };
      log(`🎶 ${player.name} は「祝福の歌」を歌った！ 6 ターン ATK +40`, 'player-action');
      break;
    }

    case 'divine_shield': {
      // 神の護り: DEF+80 バフ 5 ターン
      game.shieldActive = game.shieldActive.filter(s => s.source !== 'divine_shield');
      game.shieldActive.push({ defenseBonus: 80, turnsLeft: 5, source: 'divine_shield', name: '神の護り' });
      log(`🛡 ${player.name} は「神の護り」を展開した！ 5 ターン DEF +80`, 'player-action');
      break;
    }

    case 'holy_slumber': {
      // 神聖なうたい寝: 3ターン後にHPを大回復（遅延回復）
      const healAmt = 100 + player.level * 4;
      game.playerDelayedHeal = { healAmt, turnsLeft: 3 };
      log(`🎵 ${player.name} は「神聖なうたい寝」を歌った！ 3 ターン後に HP +${healAmt} が回復する…`, 'player-action');
      break;
    }

    /* ── 戦士新スキル ── */

    case 'earth_crash': {
      // 大地砕き: ATK×2.2 + 15%スタン＋常時ATK大幅低下デバフ
      const raw = Math.floor(player.effectiveAttack * 2.2) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      const stunned = Math.random() < 0.15;
      game.enemyStunned = stunned;
      // 常時ATK大幅低下デバフを付与（スタン有無にかかわらず）
      game.enemyAtkDebuff = { factor: 0.70, turnsLeft: 3 };
      if (stunned) {
        log(`🌋 ${player.name} は「大地砕き」を放った！ → ${enemy.name} に ${dmg} ダメージ！スタン＋ATK大幅低下！`, 'player-action');
      } else {
        log(`🌋 ${player.name} は「大地砕き」を放った！ → ${enemy.name} に ${dmg} ダメージ！ATK大幅低下！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'annihilation': {
      // 滅却の一撃: ATK×3.0 + 壊滅的 ATK デバフ（3 ターン）
      const raw = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(dmg);
      game.enemyAtkDebuff = { factor: 0.50, turnsLeft: 3 };
      log(`💀 ${player.name} は「滅却の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！攻撃力が壊滅的に低下！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'battle_trance': {
      // 戦神の覚醒: ATK+35 バフ 4 ターン + DEF+25 バフ 4 ターン
      game.playerAtkBuff = { bonus: 35, turnsLeft: 4 };
      game.shieldActive = game.shieldActive.filter(s => s.source !== 'battle_trance');
      game.shieldActive.push({ defenseBonus: 25, turnsLeft: 4, source: 'battle_trance', name: '戦神の覚醒' });
      log(`⚡ ${player.name} は「戦神の覚醒」を発動！ 4 ターン ATK +35 / DEF +25`, 'player-action');
      break;
    }

    case 'ogre_strike': {
      // 鬼神の一撃: ATK×4.0 + 25%スタン＋常時ATK強力低下デバフ
      const raw = Math.floor(player.effectiveAttack * 4.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-5, 9)), 'deal');
      enemy.takeDamage(dmg);
      const stunned = Math.random() < 0.25;
      game.enemyStunned = stunned;
      // 常時ATK強力低下デバフを付与（スタン有無にかかわらず）
      game.enemyAtkDebuff = { factor: 0.60, turnsLeft: 3 };
      if (stunned) {
        log(`👹 ${player.name} は「鬼神の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！スタン＋ATK強力低下！`, 'player-action');
      } else {
        log(`👹 ${player.name} は「鬼神の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！ATK強力低下！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    /* ── 魔剣士スキル ── */

    case 'magic_condense': {
      // 魔力凝縮: 次のターン ATK×4.0・被ダメ×1.5（justSet=true で発動ターンは即消費しない）
      game.playerCondense = { atkMultiplier: 4.0, dmgMultiplier: 1.5, justSet: true };
      log(`💎 ${player.name} は「魔力凝縮」を発動！次の攻撃が ATK×4.0！（この間 被ダメ ×1.5）`, 'player-action');
      break;
    }

    case 'magic_sword_strike': {
      // 魔剣強撃: ATK×3.5 / 40%で防御を無視する会心
      const ignoresDef = Math.random() < 0.40;
      const defFactor  = ignoresDef ? 0 : SKILL_DEFENSE_FACTOR;
      const raw = Math.floor(player.effectiveAttack * 3.5) - Math.floor(enemy.defense * defFactor);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      if (ignoresDef) {
        log(`⚔🔮 ${player.name} は「魔剣強撃」で防御を貫いた！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
      } else {
        log(`⚔🔮 ${player.name} は「魔剣強撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'magic_burst_slash': {
      // 魔力爆破斬: 物理ATK×4.5 + 魔法ATK×0.8追加ダメ（魔法部分は防御無視）
      const rawPhys = Math.floor(player.effectiveAttack * 4.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const physDmg = applyEquipmentEffects(Math.max(1, rawPhys + randInt(-4, 6)), 'deal');
      const magicDmg = Math.floor(player.effectiveAttack * 0.8);
      const totalDmg = physDmg + magicDmg;
      enemy.takeDamage(totalDmg);
      log(`🔮💥 ${player.name} は「魔力爆破斬」を放った！ → ${enemy.name} に ${physDmg}+${magicDmg}(魔法) = ${totalDmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'magic_gale_slash': {
      // 魔剣烈風斬: ATK×2.8 の 2 連撃（合計 ATK×5.6 相当）
      const raw1 = Math.floor(player.effectiveAttack * 2.8) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg1 = applyEquipmentEffects(Math.max(1, raw1 + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg1);
      let dmg2 = 0;
      if (enemy.isAlive()) {
        const raw2 = Math.floor(player.effectiveAttack * 2.8) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        dmg2 = applyEquipmentEffects(Math.max(1, raw2 + randInt(-3, 5)), 'deal');
        enemy.takeDamage(dmg2);
      }
      log(`⚔🌪 ${player.name} は「魔剣烈風斬」を放った！ → ${enemy.name} に ${dmg1}+${dmg2} = ${dmg1 + dmg2} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'makenshi_awakening': {
      // 魔剣士の覚醒: ATK×1.5 倍率バフ 3 ターン + DEF×1.3 倍率バフ 3 ターン
      game.playerMakenshiAwakeningBuff = { atkMultiplier: 1.5, defMultiplier: 1.3, turnsLeft: 3 };
      log(`🌌 ${player.name} は「魔剣士の覚醒」を発動！3 ターン ATK ×1.5 / DEF ×1.3！`, 'player-action');
      break;
    }

    case 'absolute_magic_slash': {
      // 絶界魔剣斬: ATK×9.0 / 防御を完全に無視する究極の一撃
      const raw = Math.floor(player.effectiveAttack * 9.0);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-5, 10)), 'deal');
      enemy.takeDamage(dmg);
      log(`🌌⚡ ${player.name} は「絶界魔剣斬」を解放した！ → ${enemy.name} に ${dmg} ダメージ！（防御完全無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 聖騎士スキル ── */

    case 'paladin_heal': {
      // 聖盾展開: DEF×1.5 を3ターン継続（同スキルの重複発動はNG）
      if (game.shieldActive.some(s => s.source === 'paladin_heal')) {
        player.mp += skill.mpCost;
        log('⚠ 聖盾展開はすでに発動中です。', 'system');
        setButtonsEnabled(true);
        return;
      }
      // bonus = defense * 0.5 → 敵攻撃からの軽減はbase+bonus = defense*1.5 相当
      const bonus = Math.floor(player.defense * 0.5);
      game.shieldActive.push({ defenseBonus: bonus, turnsLeft: 3, source: 'paladin_heal', name: '聖盾展開' });
      log(`✨ ${player.name} は「聖盾展開」を展開した！ 3 ターン DEF ×1.5（+${bonus}）`, 'player-action');
      break;
    }

    case 'paladin_big_heal': {
      // 神聖回復: 最大HPの15%リジェネ を2ターン継続（同スキルの重複発動はNG）
      if (game.playerRegen.some(r => r.source === 'paladin_big_heal')) {
        player.mp += skill.mpCost;
        log('⚠ 神聖回復はすでに発動中です。', 'system');
        setButtonsEnabled(true);
        return;
      }
      const hpPerTurn = Math.floor(player.maxHp * 0.15);
      game.playerRegen.push({ hpPerTurn, turnsLeft: 2, source: 'paladin_big_heal', preTurn: true });
      log(`💖 ${player.name} は「神聖回復」を唱えた！ 2 ターン HP +${hpPerTurn}/ターン（最大HP15%）リジェネ！`, 'player-action');
      break;
    }

    case 'shield_bash': {
      // 神盾突き: ATK×1.5 + DEF×1.3を4ターン継続（同スキルの重複発動はNG）
      if (game.shieldActive.some(s => s.source === 'shield_bash')) {
        player.mp += skill.mpCost;
        log('⚠ 神盾突きのDEFバフはすでに発動中です。', 'system');
        setButtonsEnabled(true);
        return;
      }
      const raw = Math.floor(player.effectiveAttack * 1.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 3)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      // bonus = defense * 0.3 → 敵攻撃からの軽減はbase+bonus = defense*1.3 相当
      const bonus = Math.floor(player.defense * 0.3);
      game.shieldActive.push({ defenseBonus: bonus, turnsLeft: 4, source: 'shield_bash', name: '神盾突き' });
      log(`🛡 ${player.name} は「神盾突き」を放った！ → ${enemy.name} に ${dmg} ダメージ！DEF ×1.3（+${bonus}、4ターン）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'holy_slash': {
      // 聖光斬り: ATK×3 + 最大HPの35%回復
      const raw = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      const healAmt = Math.floor(player.maxHp * 0.35);
      player.heal(healAmt);
      log(`⚔✨ ${player.name} は「聖光斬り」を放った！ → ${enemy.name} に ${dmg} ダメージ！HP +${healAmt} 回復（最大HP35%）！`, 'player-action');
      renderEnemyStatus();
      renderPlayerStatus();
      break;
    }

    case 'divine_judgment': {
      // 神聖無双: 最大HP30%リジェネ3ターン + DEF×1.5 + 反撃の構え100%（同スキルの重複発動はNG）
      if (game.divineJudgmentActive) {
        player.mp += skill.mpCost;
        log('⚠ 神聖無双はすでに発動中です。', 'system');
        setButtonsEnabled(true);
        return;
      }
      const hpPerTurn = Math.floor(player.maxHp * 0.30);
      game.playerRegen.push({ hpPerTurn, turnsLeft: 3, source: 'divine_judgment', preTurn: true });
      // bonus = defense * 0.5 → 敵攻撃からの軽減はbase+bonus = defense*1.5 相当
      const bonus = Math.floor(player.defense * 0.5);
      game.shieldActive.push({ defenseBonus: bonus, turnsLeft: 3, source: 'divine_judgment', name: '神聖無双' });
      game.divineJudgmentActive = { turnsLeft: 3 };
      log(`🌟 ${player.name} は「神聖無双」を解放した！ 3 ターン HP +${hpPerTurn}/ターン（最大HP30%）リジェネ！DEF ×1.5（+${bonus}）！反撃の構え100%！`, 'player-action');
      break;
    }

    /* ── 暗殺者スキル ── */

    case 'quad_slash': {
      // 四連撃: 4回 ATK×0.9 防御無視
      let totalDmg = 0;
      const hits = [];
      for (let i = 0; i < 4; i++) {
        const raw = Math.floor(player.effectiveAttack * 0.9);
        const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-1, 2)), 'deal');
        enemy.takeDamage(dmg);
        game.turnDamageDealt += dmg;
        hits.push(dmg);
        totalDmg += dmg;
        if (!enemy.isAlive()) break;
      }
      log(`🗡 ${player.name} は「四連撃」を放った！ → ${hits.join('+')} = ${totalDmg} ダメージ！（防御無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'shadow_stab': {
      // 影忍び: ATK×3.0 防御完全無視
      const raw = Math.floor(player.effectiveAttack * 3.0);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`🌑 ${player.name} は「影忍び」を放った！ → ${enemy.name} に ${dmg} ダメージ！（防御完全無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'penta_slash': {
      // 五連撃: 5回 ATK×1.0 防御無視
      let totalDmg = 0;
      const hits = [];
      for (let i = 0; i < 5; i++) {
        const raw = Math.floor(player.effectiveAttack * 1.0);
        const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-1, 3)), 'deal');
        enemy.takeDamage(dmg);
        game.turnDamageDealt += dmg;
        hits.push(dmg);
        totalDmg += dmg;
        if (!enemy.isAlive()) break;
      }
      log(`🗡🗡 ${player.name} は「五連撃」を放った！ → ${hits.join('+')} = ${totalDmg} ダメージ！（防御無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'killing_edge': {
      // 必殺刃: ATK×6.0 防御完全無視
      const raw = Math.floor(player.effectiveAttack * 6.0);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-5, 8)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`💀 ${player.name} は「必殺刃」を放った！ → ${enemy.name} に ${dmg} ダメージ！（防御完全無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'shadow_flurry': {
      // 影乱れ斬り: 4連撃 各ATK×1.5 防御完全無視
      let totalDmg = 0;
      const hits = [];
      for (let i = 0; i < 4; i++) {
        const raw = Math.floor(player.effectiveAttack * 1.5);
        const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
        enemy.takeDamage(dmg);
        game.turnDamageDealt += dmg;
        hits.push(dmg);
        totalDmg += dmg;
        if (!enemy.isAlive()) break;
      }
      log(`🌑💨 ${player.name} は「影乱れ斬り」を放った！ → ${hits.join('+')} = ${totalDmg} ダメージ！（防御完全無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'death_reaper': {
      // 死神の一撃: ATK×8.0 防御完全無視
      const raw = Math.floor(player.effectiveAttack * 8.0);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-6, 10)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`💀🌑 ${player.name} は「死神の一撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！（防御完全無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'abyss_drop': {
      // 奈落落とし: ATK×12.0 防御完全無視
      const raw = Math.floor(player.effectiveAttack * 12.0);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-8, 12)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`🕳 ${player.name} は「奈落落とし」を解放した！ → ${enemy.name} に ${dmg} ダメージ！（防御完全無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── 賢者スキル ── */

    case 'sage_blast': {
      // 属性魔法: ATK×1.0 攻撃 + 最大HPの15%回復
      const raw = Math.floor(player.effectiveAttack * 1.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 3)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      const healAmt = Math.max(1, Math.floor(player.maxHp * 0.15));
      player.heal(healAmt);
      log(`🔮 ${player.name} は「属性魔法」を放った！ → ${enemy.name} に ${dmg} ダメージ！HP +${healAmt} 回復！`, 'player-action');
      renderEnemyStatus();
      renderPlayerStatus();
      break;
    }

    case 'sage_debuff': {
      // 弱体魔法: 敵ATK大幅低下（3ターン × 0.45）
      game.enemyAtkDebuff = { factor: 0.45, turnsLeft: 3 };
      log(`📖 ${player.name} は「弱体魔法」を唱えた！ ${enemy.name} のATKが大幅低下！（3ターン）`, 'player-action');
      break;
    }

    case 'sage_buff': {
      // 強化魔法: ATK×1.2 / DEF×1.2 倍率バフ 5ターン（全体強化と相乗）
      game.playerSageBuff = { atkMultiplier: 1.2, defMultiplier: 1.2, turnsLeft: 5 };
      log(`📖✨ ${player.name} は「強化魔法」を唱えた！ 5ターン ATK×1.2 / DEF×1.2`, 'player-action');
      break;
    }

    case 'holy_magic_fusion': {
      // 聖魔融合: ATK×2.5 攻撃 + 最大HPの10%回復
      const raw = Math.floor(player.effectiveAttack * 2.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      const healAmt = Math.max(1, Math.floor(player.maxHp * 0.10));
      player.heal(healAmt);
      log(`⚔📖 ${player.name} は「聖魔融合」を放った！ → ${enemy.name} に ${dmg} ダメージ！HP +${healAmt} 回復！`, 'player-action');
      renderEnemyStatus();
      renderPlayerStatus();
      break;
    }

    case 'magic_collapse': {
      // 魔力崩壊: ATK×1.5 攻撃 + 敵ATK大幅デバフ
      const raw = Math.floor(player.effectiveAttack * 1.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 3)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      game.enemyAtkDebuff = { factor: 0.40, turnsLeft: 3 };
      log(`💥📖 ${player.name} は「魔力崩壊」を放った！ → ${enemy.name} に ${dmg} ダメージ！ATKが壊滅的に低下！（3ターン）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'wisdom_wave': {
      // 知恵の波動: ATK×3.5 攻撃 + 最大HPの20%大回復
      const raw = Math.floor(player.effectiveAttack * 3.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 6)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      const healAmt = Math.max(1, Math.floor(player.maxHp * 0.20));
      player.heal(healAmt);
      log(`🌊📖 ${player.name} は「知恵の波動」を放った！ → ${enemy.name} に ${dmg} ダメージ！HP +${healAmt} 回復！`, 'player-action');
      renderEnemyStatus();
      renderPlayerStatus();
      break;
    }

    case 'sage_mega_buff': {
      // 全体強化: ATK×1.5 / DEF×1.4 倍率バフ 4ターン（強化魔法と相乗）
      game.playerSageMegaBuff = { atkMultiplier: 1.5, defMultiplier: 1.4, turnsLeft: 4 };
      log(`📖🌟 ${player.name} は「全体強化」を唱えた！ 4ターン ATK×1.5 / DEF×1.4`, 'player-action');
      break;
    }

    case 'absolute_magic': {
      // 絶対魔法: ATK×7.0 + 与ダメージの50%HP回復
      const raw = Math.floor(player.effectiveAttack * 7.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-6, 10)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      const healAmt = Math.max(1, Math.floor(dmg * 0.5));
      player.heal(healAmt);
      log(`🌌📖 ${player.name} は「絶対魔法」を解放した！ → ${enemy.name} に ${dmg} ダメージ！HP +${healAmt} 回復！`, 'player-action');
      renderEnemyStatus();
      renderPlayerStatus();
      break;
    }

    /* ── 狂戦士スキル ── */

    case 'blood_price': {
      // 血の代償: HP30消費 + ATK×2.5 防御無視
      const hpCost = Math.min(30, player.hp - 1);
      player.hp = Math.max(1, player.hp - hpCost);
      log(`🩸 ${player.name} はHPを ${hpCost} 消費した！（残HP: ${player.hp}）`, 'player-action');
      renderPlayerStatus();
      const raw = Math.floor(player.effectiveAttack * 2.5);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`💢 ${player.name} は「血の代償」を放った！ → ${enemy.name} に ${dmg} ダメージ！（防御無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'berserk_stab': {
      // 狂乱突き: ATK×2.0
      const raw = Math.floor(player.effectiveAttack * 2.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-2, 4)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`💢 ${player.name} は「狂乱突き」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'self_harm_strike': {
      // 自傷攻撃: 最大HPの20%消費 + ATK×3.5 防御完全無視
      const hpCost = Math.min(Math.floor(player.maxHp * 0.20), player.hp - 1);
      player.hp = Math.max(1, player.hp - hpCost);
      log(`🩸 ${player.name} はHPを ${hpCost} 消費した！（残HP: ${player.hp}）`, 'player-action');
      renderPlayerStatus();
      const raw = Math.floor(player.effectiveAttack * 3.5);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-3, 6)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`💢🩸 ${player.name} は「自傷攻撃」を放った！ → ${enemy.name} に ${dmg} ダメージ！（防御完全無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'lethal_blade': {
      // 絶命の刃: ATK×4.0
      const raw = Math.floor(player.effectiveAttack * 4.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`⚔💀 ${player.name} は「絶命の刃」を放った！ → ${enemy.name} に ${dmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'blood_rampage': {
      // 血の蹂躙: ATK×3.0 × 2 連撃
      const raw1 = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const dmg1 = applyEquipmentEffects(Math.max(1, raw1 + randInt(-3, 5)), 'deal');
      enemy.takeDamage(dmg1);
      game.turnDamageDealt += dmg1;
      let dmg2 = 0;
      if (enemy.isAlive()) {
        const raw2 = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        dmg2 = applyEquipmentEffects(Math.max(1, raw2 + randInt(-3, 5)), 'deal');
        enemy.takeDamage(dmg2);
        game.turnDamageDealt += dmg2;
      }
      log(`💢🩸 ${player.name} は「血の蹂躙」を放った！ → ${dmg1}+${dmg2} = ${dmg1 + dmg2} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'berserk_rampage': {
      // 怒りの暴走: 最大HPの30%消費 + ATK×6.0 防御完全無視
      const hpCost = Math.min(Math.floor(player.maxHp * 0.30), player.hp - 1);
      player.hp = Math.max(1, player.hp - hpCost);
      log(`🩸 ${player.name} はHPを ${hpCost} 消費した！（残HP: ${player.hp}）`, 'player-action');
      renderPlayerStatus();
      const raw = Math.floor(player.effectiveAttack * 6.0);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-5, 9)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`💢🌋 ${player.name} は「怒りの暴走」を放った！ → ${enemy.name} に ${dmg} ダメージ！（防御完全無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'annihilation_strike': {
      // 絶滅の一撃: 最大HPの50%消費 + ATK×12.0 防御完全無視
      const hpCost = Math.min(Math.floor(player.maxHp * 0.50), player.hp - 1);
      player.hp = Math.max(1, player.hp - hpCost);
      log(`🩸 ${player.name} はHPを ${hpCost} 消費した！（残HP: ${player.hp}）`, 'player-action');
      renderPlayerStatus();
      const raw = Math.floor(player.effectiveAttack * 12.0);
      const dmg = applyEquipmentEffects(Math.max(1, raw + randInt(-8, 15)), 'deal');
      enemy.takeDamage(dmg);
      game.turnDamageDealt += dmg;
      log(`💀🌌 ${player.name} は「絶滅の一撃」を解放した！ → ${enemy.name} に ${dmg} ダメージ！（防御完全無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── ルーンナイトスキル ── */

    case 'rk_skill_01': {
      // ルーン付与: バトル終了までATK×4.0バフ・被ダメ×1.5（重複不可）
      if (game.runeGrantActive) {
        log('⚠ 「ルーン付与」はすでに発動中です！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      game.runeGrantActive = true;
      game.runeGrantAtkMult = 4.0;
      game.runeGrantDmgMult = 1.5;
      log(`✨ ${player.name} は「ルーン付与」を発動！ATK×4.0バフ・被ダメ×1.5（バトル終了まで）`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'rk_skill_02': {
      // ルーン強撃: ATK×4.0ダメージ＋50%で敵DEF3ターン0＋会心率+50%判定
      const rkCrit = Math.random() < 0.50;
      const rkMultiplier = game.runeReleaseActive ? 8.0 : 4.0;
      const rkRaw = Math.floor(player.effectiveAttack * rkMultiplier);
      const rkDmg = applyEquipmentEffects(Math.max(1, rkRaw + randInt(-5, 8)), 'deal');
      enemy.takeDamage(rkDmg);
      game.turnDamageDealt += rkDmg;
      log(`⚡ ${player.name} は「ルーン強撃」を放った！ → ${enemy.name} に ${rkDmg} ダメージ！`, 'player-action');
      if (rkCrit) {
        const debuffTurns = game.runeReleaseActive ? 6 : 3;
        if (!game.enemyDefDebuff) {
          game.enemyDefDebuff = { factor: 0, turnsLeft: debuffTurns, source: 'rk_skill_02' };
        } else {
          game.enemyDefDebuff.factor   = 0;
          game.enemyDefDebuff.turnsLeft = debuffTurns;
        }
        log(`💥 会心！${enemy.name} のDEFが${debuffTurns}ターン間0になった！`, 'player-action');
      }
      renderEnemyStatus();
      break;
    }

    case 'rk_skill_03': {
      // ルーン爆裂斬: 1撃目ATK×4.0＋2撃目ATK×2.5（50%で次ターン敵ATK×0.5デバフ）
      const rkM1 = game.runeReleaseActive ? 8.0 : 4.0;
      const rkM2 = game.runeReleaseActive ? 5.0 : 2.5;
      const rkD1Raw = Math.floor(player.effectiveAttack * rkM1) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const rkD1 = applyEquipmentEffects(Math.max(1, rkD1Raw + randInt(-5, 8)), 'deal');
      enemy.takeDamage(rkD1);
      game.turnDamageDealt += rkD1;
      let rkD2 = 0;
      if (enemy.isAlive()) {
        const rkD2Raw = Math.floor(player.effectiveAttack * rkM2) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        rkD2 = applyEquipmentEffects(Math.max(1, rkD2Raw + randInt(-3, 5)), 'deal');
        enemy.takeDamage(rkD2);
        game.turnDamageDealt += rkD2;
        const debuffChance = game.runeReleaseActive ? 1.0 : 0.50;
        if (Math.random() < debuffChance) {
          game.pendingEffects.push({ type: 'debuff_atkFactor', turnsLeft: 1, value: 0.5, skillId: 'rk_skill_03' });
          log(`💢 次ターン敵ATK×0.5デバフを付与！`, 'player-action');
        }
      }
      log(`⚡💥 ${player.name} は「ルーン爆裂斬」を放った！ → ${enemy.name} に ${rkD1}＋${rkD2} = ${rkD1 + rkD2} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'rk_skill_04': {
      // ルーンストライク: ATK×2.4の3連撃（各種確率効果）
      const rkSMult = game.runeReleaseActive ? 4.8 : 2.4;
      let rkTotal = 0;
      for (let i = 0; i < 3; i++) {
        if (!enemy.isAlive()) break;
        const rkHitRaw = Math.floor(player.effectiveAttack * rkSMult) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        const rkHit = applyEquipmentEffects(Math.max(1, rkHitRaw + randInt(-3, 5)), 'deal');
        enemy.takeDamage(rkHit);
        game.turnDamageDealt += rkHit;
        rkTotal += rkHit;
        const chance1 = game.runeReleaseActive ? 0.60 : 0.30;
        const chance2 = game.runeReleaseActive ? 0.60 : 0.30;
        const chance3 = game.runeReleaseActive ? 0.30 : 0.15;
        if (i === 0 && Math.random() < chance1) {
          if (!game.runeStrikeAtkBuff) game.runeStrikeAtkBuff = { factor: 1.0, permanent: true };
          game.runeStrikeAtkBuff.factor *= 1.3;
          log(`✨ 1撃目：自ATK×1.3バフ付与（累積）！`, 'player-action');
        }
        if (i === 1 && Math.random() < chance2) {
          if (!game.enemyDefDebuff || game.enemyDefDebuff.factor > 0.6) {
            game.enemyDefDebuff = { factor: 0.6, turnsLeft: 99, source: 'rk_skill_04' };
          }
          log(`💢 2撃目：敵DEF×0.6デバフ付与！`, 'player-action');
        }
        if (i === 2 && Math.random() < chance3) {
          game.enemyStunned = true;
          log(`⚡ 3撃目：スタン発動！`, 'player-action');
        }
      }
      log(`⚡⚡⚡ ${player.name} は「ルーンストライク」で3連撃！ → ${enemy.name} に合計 ${rkTotal} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'rk_skill_05': {
      // ルーン解放: バトル中消費MP×2の代わりにスキル効果×2（バトル中1回）
      if (game.runeReleaseActive) {
        log('⚠ 「ルーン解放」はすでに発動中です！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      if (game.runeReleaseUsed) {
        log('⚠ 「ルーン解放」はバトル中1回しか使用できません！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      game.runeReleaseActive = true;
      game.runeReleaseUsed   = true;
      log(`✨🌌 ${player.name} は「ルーン解放」を発動！消費MP×2・スキル効果×2（バトル終了まで）`, 'player-action');
      break;
    }

    case 'rk_skill_06': {
      // ルーンカタクリズム: 自ATK・DEF×0.5（次ターン）＋ATK×4.0の5連撃＋敵DEF永続0
      const rkCMult = game.runeReleaseActive ? 8.0 : 4.0;
      let rkCTotal = 0;
      for (let i = 0; i < 5; i++) {
        if (!enemy.isAlive()) break;
        const rkCRaw = Math.floor(player.effectiveAttack * rkCMult) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        const rkCHit = applyEquipmentEffects(Math.max(1, rkCRaw + randInt(-5, 10)), 'deal');
        enemy.takeDamage(rkCHit);
        game.turnDamageDealt += rkCHit;
        rkCTotal += rkCHit;
      }
      // 次ターン自ATK・DEF×0.5（pendingEffectsで管理）
      game.pendingEffects.push({ type: 'self_debuff_atkdef', turnsLeft: 1, value: 0.5, skillId: 'rk_skill_06' });
      // 敵DEF永続0
      game.enemyDefDebuff = { factor: 0, turnsLeft: 999, source: 'rk_skill_06' };
      log(`🌌💥 ${player.name} は「ルーンカタクリズム」を解放！ → ${enemy.name} に5連撃 合計 ${rkCTotal} ダメージ！敵DEF永続0！（次ターン自ATK・DEF×0.5）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    /* ── クルセイダースキル ── */

    case 'cr_skill_01': {
      // 聖域展開: DEF×1.7バフ2ターン＋即時HP10%回復（重複不可）
      const existingCrShield = game.shieldActive.find(s => s.source === 'cr_skill_01');
      if (existingCrShield) {
        log('⚠ 「聖域展開」はすでに発動中です！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      const crDefBonus = Math.floor(player.effectiveDefense * 0.7);
      game.shieldActive.push({ defenseBonus: crDefBonus, turnsLeft: 2, source: 'cr_skill_01', name: '聖域展開' });
      const crHeal = Math.floor(player.maxHp * 0.10);
      player.heal(crHeal);
      log(`✝ ${player.name} は「聖域展開」を発動！DEF+${crDefBonus}バフ2ターン＋HP +${crHeal} 回復！`, 'player-action');
      renderPlayerStatus();
      break;
    }

    case 'cr_skill_02': {
      // クルセイドヒール: 即時最大HP20%回復＋2ターン後に最大HP20%回復
      const crH1 = Math.floor(player.maxHp * 0.20);
      player.heal(crH1);
      log(`💚 ${player.name} は「クルセイドヒール」を使用！即時HP +${crH1} 回復！`, 'player-action');
      const crH2 = Math.floor(player.maxHp * 0.20);
      game.pendingEffects.push({ type: 'heal', turnsLeft: 2, value: crH2, skillId: 'cr_skill_02' });
      log(`💚 2ターン後にさらにHP +${crH2} 回復予定…`, 'system');
      renderPlayerStatus();
      break;
    }

    case 'cr_skill_03': {
      // クルセイドバッシュ: ATK×1.5ダメージ＋DEF×1.5バフ3ターン＋敵ATK×0.7デバフ3ターン
      const crBRaw = Math.floor(player.effectiveAttack * 1.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const crBDmg = applyEquipmentEffects(Math.max(1, crBRaw + randInt(-3, 5)), 'deal');
      enemy.takeDamage(crBDmg);
      game.turnDamageDealt += crBDmg;
      const crBDef = Math.floor(player.effectiveDefense * 0.5);
      game.shieldActive.push({ defenseBonus: crBDef, turnsLeft: 3, source: 'cr_skill_03', name: 'クルセイドバッシュ防御バフ' });
      if (!game.enemyAtkDebuff || game.enemyAtkDebuff.factor > 0.7) {
        game.enemyAtkDebuff = { factor: 0.7, turnsLeft: 3 };
      }
      log(`✝⚔ ${player.name} は「クルセイドバッシュ」！ → ${enemy.name} に ${crBDmg} ダメージ！DEFバフ3ターン＋敵ATK×0.7デバフ3ターン！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'cr_skill_04': {
      // 聖十字斬: ATK×2.5の2連撃＋最大HP40%即時回復
      const crX1Raw = Math.floor(player.effectiveAttack * 2.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const crX1 = applyEquipmentEffects(Math.max(1, crX1Raw + randInt(-4, 7)), 'deal');
      enemy.takeDamage(crX1);
      game.turnDamageDealt += crX1;
      let crX2 = 0;
      if (enemy.isAlive()) {
        const crX2Raw = Math.floor(player.effectiveAttack * 2.5) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        crX2 = applyEquipmentEffects(Math.max(1, crX2Raw + randInt(-4, 7)), 'deal');
        enemy.takeDamage(crX2);
        game.turnDamageDealt += crX2;
      }
      const crXHeal = Math.floor(player.maxHp * 0.40);
      player.heal(crXHeal);
      log(`✝✨ ${player.name} は「聖十字斬」を放った！ → ${enemy.name} に ${crX1}＋${crX2} ダメージ！HP +${crXHeal} 回復！`, 'player-action');
      renderPlayerStatus();
      renderEnemyStatus();
      break;
    }

    case 'cr_skill_05': {
      // クルセイドアポカリプス: 即時HP50%回復＋敵ATK・DEF段階デバフ＋3ターン後ATK×20防御無視ダメージ
      // バトル中3ターンに1回のみ使用可能
      if (game.crusaderApocCooldown > 0) {
        log(`⚠ 「クルセイドアポカリプス」はあと${game.crusaderApocCooldown}ターン使用できません！`, 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      game.crusaderApocCooldown = 3;
      const crApHeal = Math.floor(player.maxHp * 0.50);
      player.heal(crApHeal);
      log(`✝💥 ${player.name} は「クルセイドアポカリプス」を解放！即時HP +${crApHeal} 回復！`, 'player-action');
      // 敵デバフ（ターンカウントダウン式）
      game.pendingEffects.push({ type: 'debuff_enemy_multiturn', turnsLeft: 1, value: { atk: 0, def: 0 }, skillId: 'cr_skill_05' });
      game.pendingEffects.push({ type: 'debuff_enemy_multiturn', turnsLeft: 2, value: { atk: 0.5, def: 0.5 }, skillId: 'cr_skill_05_t2' });
      game.pendingEffects.push({ type: 'debuff_enemy_multiturn', turnsLeft: 3, value: { atk: 0.75, def: 0.75 }, skillId: 'cr_skill_05_t3' });
      // 3ターン後ATK×20防御無視ダメージ
      const crApDmgVal = Math.floor(player.effectiveAttack * 20.0);
      game.pendingEffects.push({ type: 'damage_noDef', turnsLeft: 3, value: crApDmgVal, skillId: 'cr_skill_05_dmg', msgTemplate: 'クルセイドアポカリプス' });
      log(`💫 3ターン後にATK×20の防御無視ダメージが発動します…`, 'system');
      renderPlayerStatus();
      break;
    }

    /* ── ファントムスキル ── */

    case 'ph_skill_01': {
      // 影四連斬: ATK×1.0の4連撃・防御無視＋使用ターン攻撃無効化確率+30%
      const phAvoidAdd = game.runeReleaseActive ? 60 : 30;
      game.phantomAvoidChance += phAvoidAdd;
      let phFTotal = 0;
      for (let i = 0; i < 4; i++) {
        if (!enemy.isAlive()) break;
        const phFRaw = Math.floor(player.effectiveAttack * 1.0);
        const phFHit = applyEquipmentEffects(Math.max(1, phFRaw + randInt(-2, 4)), 'deal');
        enemy.takeDamage(phFHit);
        game.turnDamageDealt += phFHit;
        phFTotal += phFHit;
      }
      log(`👻⚔ ${player.name} は「影四連斬」で4連撃！ → ${enemy.name} に合計 ${phFTotal} ダメージ！（防御無視）攻撃無効化+${phAvoidAdd}%加算！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'ph_skill_02': {
      // 幻影忍び: 使用ターン攻撃無効化確率+50%＋次ターンATK×4.0ダメージ
      const phMiAdd = game.runeReleaseActive ? 100 : 50;
      game.phantomAvoidChance += phMiAdd;
      const phMiDmgVal = Math.floor(player.effectiveAttack * (game.runeReleaseActive ? 8.0 : 4.0));
      game.pendingEffects.push({ type: 'damage_noDef', turnsLeft: 1, value: phMiDmgVal, skillId: 'ph_skill_02', msgTemplate: '幻影忍び（遅延攻撃）' });
      log(`👻 ${player.name} は「幻影忍び」を使用！攻撃無効化+${phMiAdd}%加算＋次ターンATK×4.0ダメージ予約！`, 'player-action');
      break;
    }

    case 'ph_skill_03': {
      // ファントムラッシュ: 会心率+30%＋ATK×1.2の5連撃・防御無視
      const phRCritChance = game.runeReleaseActive ? 0.60 : 0.30;
      const phRMult = game.runeReleaseActive ? 2.4 : 1.2;
      const phRCrit = Math.random() < phRCritChance;
      let phRTotal = 0;
      const hitCount = 5;
      for (let i = 0; i < hitCount; i++) {
        if (!enemy.isAlive()) break;
        let phRHit = Math.floor(player.effectiveAttack * phRMult);
        if (phRCrit) phRHit = Math.floor(phRHit * 1.5);
        phRHit = applyEquipmentEffects(Math.max(1, phRHit + randInt(-3, 5)), 'deal');
        enemy.takeDamage(phRHit);
        game.turnDamageDealt += phRHit;
        phRTotal += phRHit;
      }
      const critMsg = phRCrit ? '（会心！）' : '';
      log(`👻💫 ${player.name} は「ファントムラッシュ」で5連撃！${critMsg} → ${enemy.name} に合計 ${phRTotal} ダメージ！（防御無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'ph_skill_04': {
      // 亡霊の刃: ATK×3.0防御無視＋攻撃無効化確率+20%＋毎ターンATK×4.0防御無視追加ダメージ
      const phBMult = game.runeReleaseActive ? 6.0 : 3.0;
      const phBRaw = Math.floor(player.effectiveAttack * phBMult);
      const phBDmg = applyEquipmentEffects(Math.max(1, phBRaw + randInt(-5, 8)), 'deal');
      enemy.takeDamage(phBDmg);
      game.turnDamageDealt += phBDmg;
      const phBAvoid = game.runeReleaseActive ? 40 : 20;
      game.phantomAvoidChance += phBAvoid;
      // 毎ターン追加ダメージをpendingEffectsに追加（永続：10ターン）
      if (!game.phantomBladeDoT) {
        game.phantomBladeDoT = { active: true, baseMult: 4.0 };
      }
      log(`👻🗡 ${player.name} は「亡霊の刃」を使用！ → ${enemy.name} に ${phBDmg} ダメージ！攻撃無効化+${phBAvoid}%＋毎ターン追加ダメージ付与！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'ph_skill_05': {
      // 虚影乱れ斬り: ATK×2.0の4連撃・防御無視（各撃25%で攻撃無効化確率加算、重複なし）
      const phFMult = game.runeReleaseActive ? 4.0 : 2.0;
      const phFAvoidChance = game.runeReleaseActive ? 0.50 : 0.25;
      let phFTotalDmg = 0;
      let phFAvoidAdded = false;
      for (let i = 0; i < 4; i++) {
        if (!enemy.isAlive()) break;
        const phFHRaw = Math.floor(player.effectiveAttack * phFMult);
        const phFH = applyEquipmentEffects(Math.max(1, phFHRaw + randInt(-3, 5)), 'deal');
        enemy.takeDamage(phFH);
        game.turnDamageDealt += phFH;
        phFTotalDmg += phFH;
        if (!phFAvoidAdded && Math.random() < phFAvoidChance) {
          game.phantomAvoidChance += 25;
          phFAvoidAdded = true;
          log(`✨ ${i + 1}撃目：攻撃無効化確率+25%加算！`, 'player-action');
        }
      }
      log(`👻⚔ ${player.name} は「虚影乱れ斬り」で4連撃！ → ${enemy.name} に合計 ${phFTotalDmg} ダメージ！（防御無視）`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'ph_skill_06': {
      // 亡霊の死撃: 2ターン間敵攻撃無効化確率+50%加算＋3ターン後に無効化回数×ATK×20防御無視ダメージ
      const phDMAvoidAdd = game.runeReleaseActive ? 100 : 50;
      // 2ターン間、毎ターン開始時にphantomAvoidChance+50%加算
      game.phantomDeathStrikeActive = { turnsLeft: 2, avoidAdd: phDMAvoidAdd };
      const phDMDmgBase = game.runeReleaseActive ? 40.0 : 20.0;
      game.pendingEffects.push({
        type: 'damage_phantom_death',
        turnsLeft: 3,
        value: { mult: phDMDmgBase, fallbackMult: game.runeReleaseActive ? 20.0 : 10.0 },
        skillId: 'ph_skill_06',
        msgTemplate: '亡霊の死撃'
      });
      log(`👻💀 ${player.name} は「亡霊の死撃」を発動！2ターン間攻撃無効化+${phDMAvoidAdd}%加算＋3ターン後に無効化回数×ATK×${phDMDmgBase}の防御無視ダメージ！`, 'player-action');
      // 発動後自DEF×1/3
      game.pendingEffects.push({ type: 'self_debuff_def', turnsLeft: 0, value: 1 / 3, skillId: 'ph_skill_06_def' });
      break;
    }

    case 'ph_skill_07': {
      // ファントムアビス: 使用ターン攻撃無効化+100%→2ターン+30%→3ターン後ATK×100防御完全無視
      game.phantomAvoidChance += 100;
      game.pendingEffects.push({ type: 'avoid_add', turnsLeft: 1, value: 30, skillId: 'ph_skill_07_t1' });
      game.pendingEffects.push({ type: 'avoid_add', turnsLeft: 2, value: 30, skillId: 'ph_skill_07_t2' });
      const phAbMult = game.runeReleaseActive ? 200.0 : 100.0;
      const phAbDmgVal = Math.floor(player.effectiveAttack * phAbMult);
      game.pendingEffects.push({ type: 'damage_noDef', turnsLeft: 3, value: phAbDmgVal, skillId: 'ph_skill_07_dmg', msgTemplate: 'ファントムアビス' });
      log(`👻🌌 ${player.name} は「ファントムアビス」を解放！使用ターン攻撃無効化+100%！3ターン後にATK×${phAbMult}の防御完全無視ダメージ！`, 'player-action');
      break;
    }

    /* ── オラクルスキル ── */

    case 'oc_skill_01': {
      // 予言魔法: 2ターン後にATK×5ダメージ＋最大HP30%回復（予言系）
      if (game.prophecyActive) {
        log('⚠ すでに予言が待機中です！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      const ocP1Mult = (game.oracleProphecyFlowActive ? 2.0 : 1.0) * (game.oracleOmegaProphecyActive ? 1.0 : 1.0);
      const ocP1DmgVal = Math.floor(player.effectiveAttack * 5.0 * ocP1Mult);
      const ocP1HealVal = Math.floor(player.maxHp * 0.30 * ocP1Mult);
      game.prophecyActive = { type: 'oc_skill_01', dmgVal: ocP1DmgVal, healVal: ocP1HealVal, turnsLeft: 2, mult: ocP1Mult };
      game.pendingEffects.push({ type: 'prophecy_01', turnsLeft: 2, value: { dmg: ocP1DmgVal, heal: ocP1HealVal }, skillId: 'oc_skill_01', msgTemplate: '予言魔法' });
      log(`🔮 ${player.name} は「予言魔法」を詠唱！2ターン後にATK×${5 * ocP1Mult}ダメージ＋HP+${ocP1HealVal}回復予定…`, 'system');
      break;
    }

    case 'oc_skill_02': {
      // 神罰魔法: バトル中敵ATK・DEF×0.5デバフ＋毎ターンATK×1ダメージ
      if (!game.divineJudgmentDebuff) {
        game.divineJudgmentDebuff = { atkFactor: 0.5, defFactor: 0.5, permanent: true };
        const ocDJRaw = Math.floor(player.effectiveAttack * 1.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        const ocDJDmg = applyEquipmentEffects(Math.max(1, ocDJRaw + randInt(-2, 3)), 'deal');
        enemy.takeDamage(ocDJDmg);
        game.turnDamageDealt += ocDJDmg;
        game.divinePunishmentDoT = { active: true, mult: 1.0 };
        log(`🔮⚡ ${player.name} は「神罰魔法」を解放！敵ATK・DEF×0.5デバフ（永続）＋毎ターンATK×1ダメージ付与！初撃: ${ocDJDmg} ダメージ！`, 'player-action');
        renderEnemyStatus();
      } else {
        log('⚠ 「神罰魔法」はすでに発動中です！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      break;
    }

    case 'oc_skill_03': {
      // 天啓強化: バトル中自ATK×1.3・DEF×1.3バフ＋MP消費×0.7
      if (!game.oracleEnhanceBuff) {
        game.oracleEnhanceBuff = { atkMult: 1.3, defMult: 1.3, mpCostMult: 0.7, permanent: true };
        log(`🔮✨ ${player.name} は「天啓強化」を発動！ATK×1.3・DEF×1.3バフ＋MP消費×0.7（バトル終了まで）`, 'player-action');
        renderPlayerStatus();
      } else {
        log('⚠ 「天啓強化」はすでに発動中です！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      break;
    }

    case 'oc_skill_04': {
      // 天啓聖魔: 3ターン間ランダム行動（召喚中）
      if (game.oracleSpiritActive) {
        // 聖魔暴走：MP×2消費で3ターン分の効果を一括発動
        if (player.mp < skill.mpCost) {
          log('⚠ 聖魔暴走のMP追加消費が足りません！', 'system');
          player.mp += skill.mpCost;
          setButtonsEnabled(true);
          return;
        }
        player.mp -= skill.mpCost; // 追加消費
        log(`🔮⚡ 「聖魔暴走」発動！3ターン分の効果を一括実行！`, 'player-action');
        let bursTotal = 0;
        let burstHeal = 0;
        for (let i = 0; i < 3; i++) {
          const pat = randInt(1, 3);
          if (pat === 1) {
            const bh = Math.floor(player.effectiveAttack * 3.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
            const bd = applyEquipmentEffects(Math.max(1, bh), 'deal');
            enemy.takeDamage(bd); game.turnDamageDealt += bd; bursTotal += bd;
          } else if (pat === 2) {
            const bh2 = Math.floor(player.maxHp * 0.10);
            player.heal(bh2); burstHeal += bh2;
          } else {
            const bh3 = Math.floor(player.effectiveAttack * 5.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
            const bd3 = applyEquipmentEffects(Math.max(1, bh3), 'deal');
            enemy.takeDamage(bd3); game.turnDamageDealt += bd3; bursTotal += bd3;
          }
        }
        log(`🔮 聖魔暴走：合計 ${bursTotal} ダメージ＋HP +${burstHeal} 回復！`, 'player-action');
        game.oracleSpiritActive = null;
        renderPlayerStatus();
        renderEnemyStatus();
      } else {
        // 通常召喚
        game.oracleSpiritActive = { turnsLeft: 3, pattern: 0 };
        log(`🔮 ${player.name} は「天啓聖魔」を召喚！3ターン間ランダム行動する…`, 'system');
      }
      break;
    }

    case 'oc_skill_05': {
      // 予言の崩壊: 予言魔法待機中→ATK×50強化・即時発動、終末予言待機中→HP30%消費・ATK×400即時発動、通常→ATK×20＋HP20%回復
      // 予言の奔流発動中は全効果×2
      const ocColFlowMult = game.oracleProphecyFlowActive ? 2.0 : 1.0;
      if (game.prophecyActive && game.prophecyActive.type === 'oc_skill_01') {
        // 予言魔法強化→即時発動
        const ocColMult = 50.0 * ocColFlowMult;
        const ocColDmgRaw = Math.floor(player.effectiveAttack * ocColMult) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        const ocColDmg = applyEquipmentEffects(Math.max(1, ocColDmgRaw + randInt(-10, 20)), 'deal');
        enemy.takeDamage(ocColDmg);
        game.turnDamageDealt += ocColDmg;
        // pendingEffectsから予言を削除
        game.pendingEffects = game.pendingEffects.filter(e => e.skillId !== 'oc_skill_01');
        game.prophecyActive = null;
        log(`🔮💥 ${player.name} は「予言の崩壊」で予言魔法を強化！ATK×${ocColMult}の即時ダメージ！ → ${enemy.name} に ${ocColDmg} ダメージ！`, 'player-action');
        renderEnemyStatus();
      } else if (game.prophecyActive && game.prophecyActive.type === 'oc_skill_08') {
        // 終末予言：HP30%消費＋ATK×400即時発動
        const ocColHpCost = Math.floor(player.maxHp * 0.30);
        player.hp = Math.max(1, player.hp - ocColHpCost);
        renderPlayerStatus();
        const ocColOmegaMult = 400.0 * ocColFlowMult;
        const ocColOmegaDmg = applyEquipmentEffects(Math.max(1, Math.floor(player.effectiveAttack * ocColOmegaMult)), 'deal');
        enemy.takeDamage(ocColOmegaDmg);
        game.turnDamageDealt += ocColOmegaDmg;
        game.pendingEffects = game.pendingEffects.filter(e => e.skillId !== 'oc_skill_08');
        game.prophecyActive = null;
        log(`🔮💀 ${player.name} は「予言の崩壊」で終末予言を即時発動！HP -${ocColHpCost}消費 → ${enemy.name} に ${ocColOmegaDmg} ダメージ！`, 'player-action');
        renderPlayerStatus();
        renderEnemyStatus();
      } else {
        // 通常：ATK×20＋HP20%回復
        const ocColNormMult = 20.0 * ocColFlowMult;
        const ocColNormRaw = Math.floor(player.effectiveAttack * ocColNormMult) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        const ocColNormDmg = applyEquipmentEffects(Math.max(1, ocColNormRaw + randInt(-8, 15)), 'deal');
        enemy.takeDamage(ocColNormDmg);
        game.turnDamageDealt += ocColNormDmg;
        const ocColNormHeal = Math.floor(player.maxHp * 0.20);
        player.heal(ocColNormHeal);
        log(`🔮 ${player.name} は「予言の崩壊」を放った！ → ${enemy.name} に ${ocColNormDmg} ダメージ＋HP +${ocColNormHeal} 回復！`, 'player-action');
        renderPlayerStatus();
        renderEnemyStatus();
      }
      break;
    }

    case 'oc_skill_06': {
      // 予言の奔流: バトル中予言系スキル効果×2（永続）
      if (!game.oracleProphecyFlowActive) {
        game.oracleProphecyFlowActive = true;
        log(`🔮🌊 ${player.name} は「予言の奔流」を解放！予言系スキルの効果が×2になる（バトル終了まで）`, 'player-action');
      } else {
        log('⚠ 「予言の奔流」はすでに発動中です！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      break;
    }

    case 'oc_skill_07': {
      // オラクルバースト: バトル中ATK×3・DEF×2バフ＋MP消費×1.2デバフ
      if (!game.oracleBurstActive) {
        game.oracleBurstActive = { atkMult: 3.0, defMult: 2.0, mpCostMult: 1.2, permanent: true };
        log(`🔮💥 ${player.name} は「オラクルバースト」を解放！ATK×3・DEF×2バフ＋MP消費×1.2（バトル終了まで）`, 'player-action');
        renderPlayerStatus();
      } else {
        log('⚠ 「オラクルバースト」はすでに発動中です！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      break;
    }

    case 'oc_skill_08': {
      // 終末予言: 即時最大HP30%回復＋3ターン後ATK×200防御無視（予言系）
      // 予言の奔流発動中は効果×2（ATK×400）
      if (game.prophecyActive) {
        log('⚠ すでに予言が待機中です！', 'system');
        player.mp += skill.mpCost;
        setButtonsEnabled(true);
        return;
      }
      const ocOMFlowMult = game.oracleProphecyFlowActive ? 2.0 : 1.0;
      const ocOMHeal = Math.floor(player.maxHp * 0.30 * ocOMFlowMult);
      player.heal(ocOMHeal);
      log(`🔮✨ ${player.name} は「終末予言」を詠唱！即時HP +${ocOMHeal} 回復！3ターン後にATK×${200 * ocOMFlowMult}の防御無視ダメージ…`, 'system');
      const ocOMDmgVal = Math.floor(player.effectiveAttack * 200.0 * ocOMFlowMult);
      game.prophecyActive = { type: 'oc_skill_08', dmgVal: ocOMDmgVal, turnsLeft: 3, mult: ocOMFlowMult };
      game.pendingEffects.push({ type: 'damage_noDef', turnsLeft: 3, value: ocOMDmgVal, skillId: 'oc_skill_08', msgTemplate: '終末予言' });
      renderPlayerStatus();
      break;
    }

    /* ── カタストロフスキル ── */

    case 'ct_skill_01': {
      // 血の災厄: ATK×6.0ダメージ＋最大HP10%消費
      const ctBC1Raw = Math.floor(player.effectiveAttack * 6.0) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
      const ctBC1Dmg = applyEquipmentEffects(Math.max(1, ctBC1Raw + randInt(-8, 12)), 'deal');
      enemy.takeDamage(ctBC1Dmg);
      game.turnDamageDealt += ctBC1Dmg;
      const ctBC1HpCost = Math.floor(player.maxHp * 0.10);
      player.hp = Math.max(1, player.hp - ctBC1HpCost);
      log(`💀🔥 ${player.name} は「血の災厄」を解放！HP -${ctBC1HpCost}消費 → ${enemy.name} に ${ctBC1Dmg} ダメージ！`, 'player-action');
      renderPlayerStatus();
      renderEnemyStatus();
      break;
    }

    case 'ct_skill_02': {
      // 災厄の咆哮: 30%でスタン＋3ターン間敵被ダメ×1.5（重複なし）
      const ctHowlStun = Math.random() < 0.30;
      if (ctHowlStun) {
        game.enemyStunned = true;
        log(`⚡ ${enemy.name} はスタンした！`, 'player-action');
      }
      if (!game.enemyAmpDmgActive) {
        game.enemyAmpDmgActive = { factor: 1.5, turnsLeft: 3, source: 'ct_skill_02' };
        log(`💥 ${player.name} は「災厄の咆哮」！3ターン間敵が受けるダメージ×1.5！`, 'player-action');
      } else {
        log(`💥 ${player.name} は「災厄の咆哮」！（被ダメ増加効果はすでに発動中）`, 'player-action');
      }
      break;
    }

    case 'ct_skill_03': {
      // 破滅の傷: 3ターン間毎ターン最大HP10%自傷＋バトル中ATK×5バフ＋確定会心付与
      game.pendingEffects.push({ type: 'self_damage_pct', turnsLeft: 1, value: 0.10, skillId: 'ct_skill_03_t1' });
      game.pendingEffects.push({ type: 'self_damage_pct', turnsLeft: 2, value: 0.10, skillId: 'ct_skill_03_t2' });
      game.pendingEffects.push({ type: 'self_damage_pct', turnsLeft: 3, value: 0.10, skillId: 'ct_skill_03_t3' });
      if (!game.ctRuinousWoundBuff) {
        game.ctRuinousWoundBuff = { atkMult: 5.0, guaranteedCrit: true, permanent: true };
        log(`💀✨ ${player.name} は「破滅の傷」を刻んだ！3ターン間毎ターン最大HP10%自傷＋ATK×5バフ＋確定会心付与！`, 'player-action');
      } else {
        log(`💀 ${player.name} は「破滅の傷」を重ねた！（バフはすでに発動中）`, 'player-action');
      }
      break;
    }

    case 'ct_skill_04': {
      // 滅びの刃: ATK×(最大HP－現在HP)÷最大HP×2倍ダメージ（HPが低いほど強力）
      const ctDBHpRatio = (player.maxHp - player.hp) / player.maxHp;
      const ctDBMult = Math.max(0.5, ctDBHpRatio * 2.0);
      const ctDBRaw = Math.floor(player.effectiveAttack * ctDBMult * (game.ctRuinousWoundBuff ? game.ctRuinousWoundBuff.atkMult : 1.0));
      const ctDBDmg = applyEquipmentEffects(Math.max(1, ctDBRaw + randInt(-10, 20)), 'deal');
      enemy.takeDamage(ctDBDmg);
      game.turnDamageDealt += ctDBDmg;
      log(`💀⚔ ${player.name} は「滅びの刃」を振り下ろした！（HP損失率: ${Math.floor(ctDBHpRatio * 100)}%）→ ${enemy.name} に ${ctDBDmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'ct_skill_05': {
      // 狂血蹂躙: ATK×4.0＋最大HP10%減少ごとに2連撃追加＋会心率+30%
      const ctRB = game.ctRuinousWoundBuff;
      const ctRBBase = 4.0 * (ctRB ? ctRB.atkMult : 1.0);
      const ctRBCrit = (ctRB && ctRB.guaranteedCrit) ? true : Math.random() < 0.30;
      const hpLostPct = Math.floor((player.maxHp - player.hp) / player.maxHp * 10);
      const hitCount = 1 + Math.min(hpLostPct, 5) * 2; // 最大11連撃
      let ctRBTotal = 0;
      for (let i = 0; i < hitCount; i++) {
        if (!enemy.isAlive()) break;
        let ctRBHit = Math.floor(player.effectiveAttack * ctRBBase) - Math.floor(enemy.defense * SKILL_DEFENSE_FACTOR);
        if (ctRBCrit) ctRBHit = Math.floor(ctRBHit * 1.5);
        ctRBHit = applyEquipmentEffects(Math.max(1, ctRBHit + randInt(-5, 10)), 'deal');
        enemy.takeDamage(ctRBHit);
        game.turnDamageDealt += ctRBHit;
        ctRBTotal += ctRBHit;
      }
      const ctRBCritMsg = ctRBCrit ? '（確定会心！）' : '';
      log(`💀🌪 ${player.name} は「狂血蹂躙」で${hitCount}連撃！${ctRBCritMsg} → ${enemy.name} に合計 ${ctRBTotal} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    case 'ct_skill_06': {
      // 滅亡の眼光: 2ターン間敵ATK×0.2・DEF×0.5デバフ
      game.enemyAtkDebuff = { factor: 0.2, turnsLeft: 2 };
      game.enemyDefDebuff = { factor: 0.5, turnsLeft: 2, source: 'ct_skill_06' };
      log(`💀👁 ${player.name} は「滅亡の眼光」を放った！2ターン間敵ATK×0.2・DEF×0.5デバフ！`, 'player-action');
      break;
    }

    case 'ct_skill_07': {
      // 破滅の絶撃: 現在HPの50%消費＋HP残量に応じてATK×50〜300
      const ctAbHpCost = Math.floor(player.hp * 0.50);
      player.hp = Math.max(1, player.hp - ctAbHpCost);
      renderPlayerStatus();
      const ctAbHpPct = player.hp / player.maxHp;
      let ctAbMult;
      if (ctAbHpPct >= 1.0)       ctAbMult = 300.0;
      else if (ctAbHpPct >= 0.75) ctAbMult = 200.0;
      else if (ctAbHpPct >= 0.50) ctAbMult = 100.0;
      else                         ctAbMult = 50.0;
      if (game.ctRuinousWoundBuff) ctAbMult *= game.ctRuinousWoundBuff.atkMult;
      const ctAbDmg = applyEquipmentEffects(Math.max(1, Math.floor(player.effectiveAttack * ctAbMult)), 'deal');
      enemy.takeDamage(ctAbDmg);
      game.turnDamageDealt += ctAbDmg;
      log(`💀🌌 ${player.name} は「破滅の絶撃」を解放！HP -${ctAbHpCost}消費（残HP: ${Math.floor(ctAbHpPct * 100)}%）→ ATK×${ctAbMult}で ${enemy.name} に ${ctAbDmg} ダメージ！`, 'player-action');
      renderEnemyStatus();
      break;
    }

    default:
      break;
  }

  // スキル使用後はプレイヤーターンを終了し、敵のターンへ進む
  afterPlayerTurn();
}
