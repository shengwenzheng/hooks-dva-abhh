import { getCarRoute } from "@/services/routeGuard";
import { getLayersData, getBaseInfoStat } from "@/services/fight";

export default {
  namespace: 'map',
  state: {
    controlArea: 0,
    closeIconData: [],
    carRouteList: [null, null, null],
    setLayerVisibilityFn: () => {},
    layersData: null,
    baseInfoStat: null,
    resizeMapFn: () => {},
    distanceToStartFn: () => {},
    getLengthFromRoutesAB: () => {}
  },
  effects: {
    *setControlArea({ payload }, { put }) {
      yield put({
        type: 'saveControlArea',
        payload: {
          controlArea: payload.controlArea,
        },
      });
    },
    *setCloseIconData({ payload }, { put }) {
      yield put({
        type: 'saveCloseIconData',
        payload: {
          closeIconData: payload.closeIconData,
        },
      });
    },
    *getCarRoute({ payload }, { put, call }) {
      let { code, data } = yield call(getCarRoute, payload);
      // let code = 200;
      // let data = '{"result":{"routes":[{"duration":2280,"distance":16476,"tactics":"11","destinationLocation":{"lng":"120.023958","lat":"30.279350"},"steps":[{"area":"","turn":"3","direction":"0","distance":"61","duration":"60","path":"120.13498,30.236055;120.13484,30.235924;120.134514,30.235678","instruction":"无名道路","drive_instruction":"沿无名道路向西南行驶61米右转","stepOriginLocation":{"lng":"120.13498","lat":"30.236055"},"stepDestinationLocation":{"lng":"120.134514","lat":"30.235678"},"pois":"","ispasspoi":"0","links":[{"link_id":"15728328","mesh":"H51F022002","road_id":"17505","tmc_nums":"1","tmcs":[{"distance":61,"status":0}]}]},{"area":"","turn":"7","direction":"0","distance":"101","duration":"60","path":"120.134514,30.235672;120.134415,30.235746;120.134346,30.235798;120.134186,30.23593;120.13408,30.236025;120.13387,30.236254;120.13382,30.236345","instruction":"无名道路","drive_instruction":"沿无名道路向西北行驶101米左转","stepOriginLocation":{"lng":"120.134514","lat":"30.235672"},"stepDestinationLocation":{"lng":"120.13382","lat":"30.236345"},"pois":"","ispasspoi":"0","links":[{"link_id":"15728532","mesh":"H51F022002","road_id":"641732","tmc_nums":"1","tmcs":[{"distance":12,"status":0}]},{"link_id":"15729212","mesh":"H51F022002","road_id":"641733","tmc_nums":"1","tmcs":[{"distance":89,"status":0}]}]},{"area":"","turn":"2","direction":"0","distance":"309","duration":"60","path":"120.13381,30.236345;120.13363,30.236134;120.133514,30.236046;120.13349,30.236038;120.132774,30.235712;120.132706,30.235664;120.13251,30.23556;120.132484,30.235542;120.132,30.23529;120.13195,30.23527;120.131905,30.235247;120.13182,30.235212;120.13179,30.235212;120.13172,30.235212;120.13162,30.235243;120.131325,30.2354;120.13124,30.23543;120.13118,30.23543;120.13106,30.23543","instruction":"无名道路","drive_instruction":"沿无名道路向西行驶309米向右前方行驶","stepOriginLocation":{"lng":"120.13381","lat":"30.236345"},"stepDestinationLocation":{"lng":"120.13106","lat":"30.23543"},"pois":"","ispasspoi":"0","links":[{"link_id":"15729348","mesh":"H51F022002","road_id":"641730","tmc_nums":"1","tmcs":[{"distance":46,"status":0}]},{"link_id":"15729620","mesh":"H51F022002","road_id":"641731","tmc_nums":"1","tmcs":[{"distance":77,"status":0}]},{"link_id":"15729960","mesh":"H51F022002","road_id":"606065","tmc_nums":"1","tmcs":[{"distance":31,"status":0}]},{"link_id":"15730172","mesh":"H51F022002","road_id":"640926","tmc_nums":"1","tmcs":[{"distance":62,"status":0}]},{"link_id":"15664084","mesh":"H51F022002","road_id":"640927","tmc_nums":"1","tmcs":[{"distance":17,"status":0}]},{"link_id":"15730956","mesh":"H51F022002","road_id":"337897","tmc_nums":"1","tmcs":[{"distance":76,"status":0}]}]},{"area":"","turn":"8","direction":"0","distance":"159","duration":"60","path":"120.13106,30.235426;120.13092,30.235546;120.13076,30.23569;120.13059,30.235876;120.13028,30.236212;120.130035,30.236546","instruction":"杨公堤","drive_instruction":"沿杨公堤向西北行驶159米向左前方行驶","stepOriginLocation":{"lng":"120.13106","lat":"30.235426"},"stepDestinationLocation":{"lng":"120.130035","lat":"30.236546"},"pois":"","ispasspoi":"0","links":[{"link_id":"15731092","mesh":"H51F022002","road_id":"639900","tmc_nums":"1","tmcs":[{"distance":159,"status":0}]}]},{"area":"","turn":"7","direction":"0","distance":"135","duration":"60","path":"120.129845,30.236546;120.129776,30.236618;120.1296,30.236818;120.12946,30.237026;120.1291,30.237587","instruction":"龙井支路","drive_instruction":"沿龙井支路向西北行驶135米左转","stepOriginLocation":{"lng":"120.129845","lat":"30.236546"},"stepDestinationLocation":{"lng":"120.1291","lat":"30.237587"},"pois":"","ispasspoi":"0","links":[{"link_id":"15731308","mesh":"H51F022002","road_id":"620540","tmc_nums":"1","tmcs":[{"distance":10,"status":0}]},{"link_id":"15731488","mesh":"H51F022001","road_id":"607796","tmc_nums":"1","tmcs":[{"distance":54,"status":0}]},{"link_id":"15731856","mesh":"H51F022001","road_id":"604782","tmc_nums":"1","tmcs":[{"distance":71,"status":0}]}]},{"area":"","turn":"3","direction":"0","distance":"327","duration":"60","path":"120.1291,30.237587;120.12889,30.237566;120.12875,30.237535;120.12862,30.237482;120.12821,30.237278;120.1275,30.236917;120.12743,30.23688;120.12727,30.236788;120.12717,30.236696;120.12658,30.236155;120.126396,30.235977;120.12635,30.235933","instruction":"龙井支路","drive_instruction":"沿龙井支路向西南行驶327米右转","stepOriginLocation":{"lng":"120.1291","lat":"30.237587"},"stepDestinationLocation":{"lng":"120.12635","lat":"30.235933"},"pois":"","ispasspoi":"0","links":[{"link_id":"15731788","mesh":"H51F022001","road_id":"4899","tmc_nums":"1","tmcs":[{"distance":172,"status":0}]},{"link_id":"15437744","mesh":"H51F022001","road_id":"4898","tmc_nums":"1","tmcs":[{"distance":155,"status":0}]}]},{"area":"","turn":"7","direction":"0","distance":"507","duration":"60","path":"120.12635,30.23593;120.12488,30.236914;120.12485,30.236937;120.124756,30.237036;120.12469,30.237144;120.12465,30.2372;120.124626,30.237274;120.12462,30.237387;120.12462,30.237574;120.12462,30.237995;120.1246,30.238094;120.124565,30.23829;120.12455,30.23838;120.12452,30.238482;120.12438,30.239044;120.124344,30.239176;120.12425,30.239418;120.1241,30.239748","instruction":"龙井路","drive_instruction":"沿龙井路向西北行驶507米左转","stepOriginLocation":{"lng":"120.12635","lat":"30.23593"},"stepDestinationLocation":{"lng":"120.1241","lat":"30.239748"},"pois":"","ispasspoi":"0","links":[{"link_id":"15438228","mesh":"H51F022001","road_id":"3836","tmc_nums":"1","tmcs":[{"distance":180,"status":0}]},{"link_id":"15439944","mesh":"H51F022001","road_id":"604810","tmc_nums":"1","tmcs":[{"distance":47,"status":0}]},{"link_id":"15439808","mesh":"H51F022001","road_id":"604809","tmc_nums":"1","tmcs":[{"distance":33,"status":0}]},{"link_id":"15440304","mesh":"H51F022001","road_id":"4893","tmc_nums":"1","tmcs":[{"distance":46,"status":0}]},{"link_id":"15440588","mesh":"H51F022001","road_id":"604797","tmc_nums":"1","tmcs":[{"distance":33,"status":0}]},{"link_id":"15441180","mesh":"H51F022001","road_id":"604796","tmc_nums":"1","tmcs":[{"distance":10,"status":0}]},{"link_id":"15441340","mesh":"H51F022001","road_id":"4029","tmc_nums":"1","tmcs":[{"distance":75,"status":0}]},{"link_id":"15433948","mesh":"H51F022001","road_id":"4028","tmc_nums":"1","tmcs":[{"distance":83,"status":0}]}]},{"area":"","turn":"3","direction":"0","distance":"814","duration":"120","path":"120.12409,30.239748;120.12379,30.239721;120.12292,30.239683;120.12014,30.239618;120.11853,30.239578;120.11804,30.239574;120.1177,30.239595;120.117485,30.239614;120.117035,30.239653;120.11684,30.239687;120.11672,30.239727;120.11657,30.239792;120.11648,30.239843;120.1163,30.239996;120.11614,30.240139;120.1161,30.240183;120.11603,30.240225;120.11599,30.240252;120.11593,30.240273;120.11587,30.240292","instruction":"梅灵北路","drive_instruction":"沿梅灵北路向西行驶814米右转","stepOriginLocation":{"lng":"120.12409","lat":"30.239748"},"stepDestinationLocation":{"lng":"120.11587","lat":"30.240292"},"pois":"","ispasspoi":"0","links":[{"link_id":"15433732","mesh":"H51F022001","road_id":"608035","tmc_nums":"1","tmcs":[{"distance":29,"status":0}]},{"link_id":"15445180","mesh":"H51F022001","road_id":"608034","tmc_nums":"1","tmcs":[{"distance":83,"status":0}]},{"link_id":"15445384","mesh":"H51F022001","road_id":"37387","tmc_nums":"1","tmcs":[{"distance":268,"status":0}]},{"link_id":"15443176","mesh":"H51F022001","road_id":"605000","tmc_nums":"1","tmcs":[{"distance":154,"status":0}]},{"link_id":"15445520","mesh":"H51F022001","road_id":"607269","tmc_nums":"1","tmcs":[{"distance":47,"status":0}]},{"link_id":"15446152","mesh":"H51F022001","road_id":"607270","tmc_nums":"1","tmcs":[{"distance":33,"status":0}]},{"link_id":"15446288","mesh":"H51F022001","road_id":"604998","tmc_nums":"1","tmcs":[{"distance":147,"status":0}]},{"link_id":"15446976","mesh":"H51F022001","road_id":"357","tmc_nums":"1","tmcs":[{"distance":53,"status":0}]}]},{"area":"","turn":"9","direction":"0","distance":"357","duration":"60","path":"120.11587,30.240292;120.11592,30.240438;120.11595,30.240496;120.11597,30.240568;120.116005,30.24072;120.11603,30.240843;120.116104,30.24134;120.11617,30.241814;120.11618,30.241993;120.116165,30.242157;120.11613,30.242334;120.11607,30.2425;120.115974,30.242722;120.115814,30.24299;120.11564,30.243277;120.11559,30.243382","instruction":"梅灵北路","drive_instruction":"沿梅灵北路向北行驶357米靠左","stepOriginLocation":{"lng":"120.11587","lat":"30.240292"},"stepDestinationLocation":{"lng":"120.11559","lat":"30.243382"},"pois":"","ispasspoi":"0","links":[{"link_id":"15447428","mesh":"H51F022001","road_id":"2535","tmc_nums":"1","tmcs":[{"distance":32,"status":0}]},{"link_id":"15447564","mesh":"H51F022001","road_id":"2534","tmc_nums":"1","tmcs":[{"distance":325,"status":0}]}]},{"area":"","turn":"1","direction":"0","distance":"569","duration":"60","path":"120.115585,30.243382;120.11549,30.243525;120.11542,30.243624;120.11523,30.243797;120.11511,30.243906;120.11505,30.243967;120.115036,30.244028;120.11498,30.24411;120.114914,30.244257;120.114655,30.244814;120.11436,30.245335;120.11418,30.245668;120.11403,30.245815;120.11389,30.246103;120.11385,30.246168;120.11382,30.24623;120.11377,30.246307;120.1137,30.246376;120.11357,30.246502;120.1134,30.246614;120.113266,30.246696;120.1131,30.24677;120.112206,30.247084;120.11198,30.247175","instruction":"梅灵北路","drive_instruction":"沿梅灵北路向西北行驶569米直行进入隧道","stepOriginLocation":{"lng":"120.115585","lat":"30.243382"},"stepDestinationLocation":{"lng":"120.11198","lat":"30.247175"},"pois":"","ispasspoi":"0","links":[{"link_id":"15365404","mesh":"H51F022001","road_id":"50","tmc_nums":"1","tmcs":[{"distance":83,"status":0}]},{"link_id":"15364348","mesh":"H51F022001","road_id":"2541","tmc_nums":"1","tmcs":[{"distance":16,"status":0}]},{"link_id":"15363384","mesh":"H51F022001","road_id":"2542","tmc_nums":"1","tmcs":[{"distance":211,"status":0}]},{"link_id":"15375704","mesh":"H51F022001","road_id":"2532","tmc_nums":"1","tmcs":[{"distance":60,"status":0}]},{"link_id":"15375532","mesh":"H51F022001","road_id":"2531","tmc_nums":"1","tmcs":[{"distance":9,"status":0}]},{"link_id":"15376524","mesh":"H51F022001","road_id":"1342","tmc_nums":"1","tmcs":[{"distance":190,"status":0}]}]},{"area":"","turn":"7","direction":"0","distance":"2345","duration":"240","path":"120.11198,30.247175;120.11144,30.247417;120.11141,30.24743;120.11085,30.247686;120.11003,30.24823;120.109634,30.248564;120.10377,30.254288;120.10183,30.256268;120.101524,30.25655;120.10137,30.256714;120.10129,30.256784;120.10121,30.25684;120.10102,30.256975;120.10033,30.257486;120.10026,30.257557;120.10021,30.257635;120.10019,30.257648;120.100006,30.258074;120.099915,30.258425;120.099846,30.258585;120.099396,30.259558;120.09941,30.259579;120.09942,30.259653;120.09934,30.25997;120.09912,30.2608;120.09906,30.260967;120.09899,30.261103;120.09889,30.26128;120.09858,30.261654;120.09847,30.26181;120.098404,30.261936;120.098366,30.262049;120.098335,30.262205;120.09829,30.262613;120.09828,30.262873;120.09826,30.263073;120.09821,30.263199;120.09812,30.263355;120.098045,30.263485;120.097946,30.263659;120.097885,30.263754","instruction":"灵溪北路","drive_instruction":"沿灵溪北路向西北行驶2345米左转靠左行驶进入主路","stepOriginLocation":{"lng":"120.11198","lat":"30.247175"},"stepDestinationLocation":{"lng":"120.097885","lat":"30.263754"},"pois":"","ispasspoi":"0","links":[{"link_id":"15377752","mesh":"H51F022001","road_id":"611947","tmc_nums":"1","tmcs":[{"distance":58,"status":0}]},{"link_id":"15377664","mesh":"H51F022001","road_id":"611948","tmc_nums":"1","tmcs":[{"distance":64,"status":0}]},{"link_id":"15349096","mesh":"H51F021001","road_id":"592","tmc_nums":"1","tmcs":[{"distance":1379,"status":0}]},{"link_id":"30580872","mesh":"H51F021001","road_id":"465","tmc_nums":"1","tmcs":[{"distance":133,"status":0}]},{"link_id":"30583128","mesh":"H51F021001","road_id":"3791","tmc_nums":"1","tmcs":[{"distance":50,"status":0}]},{"link_id":"30583744","mesh":"H51F021001","road_id":"11030","tmc_nums":"1","tmcs":[{"distance":178,"status":0}]},{"link_id":"30579312","mesh":"H51F021001","road_id":"38764","tmc_nums":"1","tmcs":[{"distance":196,"status":0}]},{"link_id":"30590060","mesh":"H51F021001","road_id":"38770","tmc_nums":"1","tmcs":[{"distance":51,"status":0}]},{"link_id":"30591184","mesh":"H51F021001","road_id":"38772","tmc_nums":"1","tmcs":[{"distance":111,"status":0}]},{"link_id":"30601948","mesh":"H51F021001","road_id":"38774","tmc_nums":"1","tmcs":[{"distance":28,"status":0}]},{"link_id":"30602436","mesh":"H51F021001","road_id":"38776","tmc_nums":"1","tmcs":[{"distance":72,"status":0}]},{"link_id":"30600268","mesh":"H51F021001","road_id":"38784","tmc_nums":"1","tmcs":[{"distance":33,"status":0}]}]},{"area":"","turn":"3","direction":"0","distance":"589","duration":"60","path":"120.09764,30.263945;120.09599,30.263607;120.09571,30.26355;120.09325,30.263056;120.092186,30.262848;120.09168,30.262747","instruction":"天目山路","drive_instruction":"沿天目山路向西行驶589米右转","stepOriginLocation":{"lng":"120.09764","lat":"30.263945"},"stepDestinationLocation":{"lng":"120.09168","lat":"30.262747"},"pois":"","ispasspoi":"0","links":[{"link_id":"30600712","mesh":"H51F021001","road_id":"602518","tmc_nums":"1","tmcs":[{"distance":164,"status":0}]},{"link_id":"30931900","mesh":"H51F021001","road_id":"5615","tmc_nums":"1","tmcs":[{"distance":425,"status":0}]}]},{"area":"","turn":"8","direction":"0","distance":"997","duration":"120","path":"120.091644,30.262869;120.09161,30.263103;120.09151,30.263767;120.091354,30.264774;120.09132,30.265009;120.091255,30.265747;120.091194,30.266268;120.09103,30.268667;120.09098,30.269049;120.09094,30.269367;120.09089,30.27012;120.090805,30.27079;120.09073,30.271385;120.09073,30.271427;120.090645,30.271828","instruction":"紫金港路","drive_instruction":"沿紫金港路向北行驶997米向左前方行驶进入主路","stepOriginLocation":{"lng":"120.091644","lat":"30.262869"},"stepDestinationLocation":{"lng":"120.090645","lat":"30.271828"},"pois":"","ispasspoi":"0","links":[{"link_id":"30925428","mesh":"H51F021001","road_id":"628869","tmc_nums":"1","tmcs":[{"distance":100,"status":0}]},{"link_id":"30925984","mesh":"H51F021001","road_id":"628872","tmc_nums":"1","tmcs":[{"distance":112,"status":0}]},{"link_id":"30926508","mesh":"H51F021001","road_id":"628873","tmc_nums":"1","tmcs":[{"distance":26,"status":0}]},{"link_id":"30916292","mesh":"H51F021001","road_id":"631740","tmc_nums":"1","tmcs":[{"distance":407,"status":0}]},{"link_id":"30916844","mesh":"H51F021001","road_id":"628598","tmc_nums":"1","tmcs":[{"distance":162,"status":0}]},{"link_id":"30909400","mesh":"H51F021001","road_id":"651496","tmc_nums":"1","tmcs":[{"distance":146,"status":0}]},{"link_id":"30908892","mesh":"H51F021001","road_id":"651494","tmc_nums":"1","tmcs":[{"distance":44,"status":0}]}]},{"area":"","turn":"1","direction":"0","distance":"317","duration":"60","path":"120.090645,30.271828;120.09049,30.272018;120.090385,30.272451;120.09028,30.27275;120.0901,30.273264;120.089516,30.274506","instruction":"紫金港路","drive_instruction":"沿紫金港路行驶317米直行进入隧道","stepOriginLocation":{"lng":"120.090645","lat":"30.271828"},"stepDestinationLocation":{"lng":"120.089516","lat":"30.274506"},"pois":"","ispasspoi":"0","links":[{"link_id":"30897528","mesh":"H51F021001","road_id":"628539","tmc_nums":"1","tmcs":[{"distance":25,"status":0}]},{"link_id":"30900736","mesh":"H51F021001","road_id":"651493","tmc_nums":"1","tmcs":[{"distance":292,"status":0}]}]},{"area":"","turn":"2","direction":"0","distance":"1018","duration":"120","path":"120.08951,30.274506;120.0884,30.27667;120.08828,30.276915;120.088104,30.277327;120.08794,30.277735;120.087814,30.278055;120.087524,30.278841;120.08701,30.28023;120.086716,30.280998;120.086494,30.281515;120.08623,30.282183;120.08602,30.282768;120.08596,30.283009;120.08594,30.283121;120.08594,30.283125","instruction":"紫金港路","drive_instruction":"沿紫金港路向北行驶1018米向右前方行驶进入辅路","stepOriginLocation":{"lng":"120.08951","lat":"30.274506"},"stepDestinationLocation":{"lng":"120.08594","lat":"30.283125"},"pois":"","ispasspoi":"0","links":[{"link_id":"30870348","mesh":"H51F021001","road_id":"628462","tmc_nums":"1","tmcs":[{"distance":770,"status":0}]},{"link_id":"30881020","mesh":"H51F021001","road_id":"651205","tmc_nums":"1","tmcs":[{"distance":248,"status":0}]}]},{"area":"","turn":"7","direction":"0","distance":"389","duration":"60","path":"120.086044,30.283138;120.086006,30.283333;120.085976,30.283585;120.08599,30.283663;120.08596,30.284231;120.08594,30.284615;120.08594,30.28514;120.085976,30.28563;120.08598,30.285698;120.085976,30.285786;120.08573,30.28662","instruction":"紫金港路","drive_instruction":"沿紫金港路向北行驶389米左转","stepOriginLocation":{"lng":"120.086044","lat":"30.283138"},"stepDestinationLocation":{"lng":"120.08573","lat":"30.28662"},"pois":"","ispasspoi":"0","links":[{"link_id":"31108116","mesh":"H51F021001","road_id":"651469","tmc_nums":"1","tmcs":[{"distance":58,"status":0}]},{"link_id":"31102956","mesh":"H51F021001","road_id":"624055","tmc_nums":"1","tmcs":[{"distance":331,"status":0}]}]},{"area":"","turn":"3","direction":"0","distance":"4025","duration":"360","path":"120.085014,30.286684;120.084724,30.286684;120.084305,30.286684;120.08354,30.286667;120.08318,30.28667;120.08278,30.286697;120.08255,30.286697;120.081566,30.286694;120.081375,30.286705;120.0812,30.286741;120.08082,30.286861;120.08064,30.286919;120.08053,30.286966;120.08044,30.286987;120.08033,30.28701;120.07908,30.286983;120.0782,30.286953;120.07799,30.28694;120.07679,30.286922;120.076675,30.28691;120.076126,30.286896;120.07514,30.286892;120.07416,30.286879;120.07295,30.286871;120.07125,30.286884;120.07106,30.286888;120.07073,30.286892;120.06951,30.286892;120.06946,30.286896;120.06934,30.286896;120.06869,30.286896;120.0679,30.286901;120.06698,30.286901;120.066475,30.286854;120.065926,30.286848;120.06447,30.286844;120.0633,30.286848;120.062416,30.286854;120.06217,30.286854;120.062065,30.286844;120.06148,30.28684;120.05858,30.286837;120.05802,30.28683;120.05608,30.286827;120.0547,30.286827;120.05387,30.286827;120.05247,30.2868;120.052246,30.2868;120.04939,30.286789;120.04891,30.286793;120.04848,30.286793;120.04757,30.286772;120.04686,30.286736;120.046425,30.286715;120.04566,30.286646;120.045,30.286558;120.04429,30.28645;120.04398,30.286402;120.04385,30.286375;120.043106,30.286224;120.042786,30.286142","instruction":"文一西路","drive_instruction":"沿文一西路向西行驶4025米右转","stepOriginLocation":{"lng":"120.085014","lat":"30.286684"},"stepDestinationLocation":{"lng":"120.042786","lat":"30.286142"},"pois":"","ispasspoi":"0","links":[{"link_id":"31101480","mesh":"H51F021001","road_id":"655434","tmc_nums":"1","tmcs":[{"distance":238,"status":0}]},{"link_id":"31101436","mesh":"H51F021001","road_id":"655412","tmc_nums":"1","tmcs":[{"distance":170,"status":0}]},{"link_id":"31101276","mesh":"H51F021001","road_id":"655409","tmc_nums":"1","tmcs":[{"distance":39,"status":0}]},{"link_id":"31100212","mesh":"H51F021001","road_id":"8489","tmc_nums":"1","tmcs":[{"distance":236,"status":0}]},{"link_id":"31083972","mesh":"H51F021001","road_id":"11103","tmc_nums":"1","tmcs":[{"distance":115,"status":0}]},{"link_id":"31084328","mesh":"H51F021001","road_id":"612179","tmc_nums":"1","tmcs":[{"distance":253,"status":0}]},{"link_id":"31086976","mesh":"H51F021001","road_id":"612180","tmc_nums":"1","tmcs":[{"distance":117,"status":0}]},{"link_id":"31086740","mesh":"H51F021001","road_id":"655873","tmc_nums":"1","tmcs":[{"distance":182,"status":0}]},{"link_id":"31086568","mesh":"H51F021001","road_id":"655872","tmc_nums":"1","tmcs":[{"distance":152,"status":0}]},{"link_id":"31062880","mesh":"H51F021001","road_id":"657751","tmc_nums":"1","tmcs":[{"distance":151,"status":0}]},{"link_id":"31062744","mesh":"H51F021001","road_id":"651663","tmc_nums":"1","tmcs":[{"distance":88,"status":0}]},{"link_id":"31062076","mesh":"H51F021001","road_id":"5955","tmc_nums":"1","tmcs":[{"distance":48,"status":0}]},{"link_id":"31066908","mesh":"H51F021001","road_id":"35580","tmc_nums":"1","tmcs":[{"distance":306,"status":0}]},{"link_id":"31067496","mesh":"H51F021001","road_id":"35581","tmc_nums":"1","tmcs":[{"distance":108,"status":0}]},{"link_id":"11940192","mesh":"H51F021001","road_id":"11878","tmc_nums":"1","tmcs":[{"distance":400,"status":0}]},{"link_id":"11944276","mesh":"H51F021001","road_id":"11879","tmc_nums":"1","tmcs":[{"distance":186,"status":0}]},{"link_id":"11944076","mesh":"H51F021001","road_id":"5274","tmc_nums":"1","tmcs":[{"distance":133,"status":0}]},{"link_id":"11943976","mesh":"H51F021001","road_id":"38464","tmc_nums":"1","tmcs":[{"distance":80,"status":0}]},{"link_id":"11919264","mesh":"H51F021001","road_id":"656177","tmc_nums":"1","tmcs":[{"distance":156,"status":0}]},{"link_id":"11918452","mesh":"H51F021001","road_id":"628804","tmc_nums":"1","tmcs":[{"distance":321,"status":0}]},{"link_id":"11919840","mesh":"H51F021001","road_id":"5493","tmc_nums":"1","tmcs":[{"distance":240,"status":0}]},{"link_id":"11905820","mesh":"H51F021001","road_id":"6758","tmc_nums":"1","tmcs":[{"distance":237,"status":0}]},{"link_id":"11905968","mesh":"H51F021001","road_id":"6757","tmc_nums":"1","tmcs":[{"distance":119,"status":0}]}]},{"area":"","turn":"0","direction":"0","distance":"449","duration":"60","path":"120.04278,30.286137;120.042595,30.28667;120.041824,30.288746;120.04177,30.288885;120.04153,30.289576;120.04137,30.289995","instruction":"荆长大道","drive_instruction":"沿荆长大道向北行驶449米到达途经地","stepOriginLocation":{"lng":"120.04278","lat":"30.286137"},"stepDestinationLocation":{"lng":"120.04137","lat":"30.289995"},"pois":"","ispasspoi":"1","links":[{"link_id":"11906140","mesh":"H51F021001","road_id":"11565","tmc_nums":"1","tmcs":[{"distance":62,"status":0}]},{"link_id":"11904776","mesh":"H51F021001","road_id":"631841","tmc_nums":"1","tmcs":[{"distance":258,"status":0}]},{"link_id":"11904968","mesh":"H51F021001","road_id":"628795","tmc_nums":"1","tmcs":[{"distance":80,"status":0}]},{"link_id":"11902876","mesh":"H51F021001","road_id":"653454","tmc_nums":"1","tmcs":[{"distance":49,"status":0}]}]},{"area":"","turn":"0","direction":"0","distance":"148","duration":"60","path":"120.04135,30.289995;120.04128,30.290195;120.04091,30.291176;120.040886,30.291267","instruction":"荆长大道","drive_instruction":"沿荆长大道向北行驶148米左转调头进入左侧道路","stepOriginLocation":{"lng":"120.04135","lat":"30.289995"},"stepDestinationLocation":{"lng":"120.040886","lat":"30.291267"},"pois":"","ispasspoi":"0","links":[{"link_id":"11902876","mesh":"H51F021001","road_id":"653454","tmc_nums":"1","tmcs":[{"distance":23,"status":0}]},{"link_id":"11855824","mesh":"H51F021001","road_id":"653455","tmc_nums":"1","tmcs":[{"distance":125,"status":0}]}]},{"area":"","turn":"3","direction":"0","distance":"597","duration":"60","path":"120.040726,30.291246;120.04093,30.29075;120.04106,30.290403;120.041145,30.290165;120.041374,30.289566;120.04138,30.28954;120.041595,30.28895;120.04165,30.28879;120.04169,30.288712;120.04222,30.287222;120.04224,30.287191;120.042336,30.28691;120.04238,30.286776;120.042534,30.286333;120.04258,30.286211;120.0426,30.286102","instruction":"荆长大道","drive_instruction":"沿荆长大道向南行驶597米右转","stepOriginLocation":{"lng":"120.040726","lat":"30.291246"},"stepDestinationLocation":{"lng":"120.0426","lat":"30.286102"},"pois":"","ispasspoi":"0","links":[{"link_id":"11856384","mesh":"H51F021001","road_id":"654743","tmc_nums":"1","tmcs":[{"distance":127,"status":0}]},{"link_id":"11902808","mesh":"H51F021001","road_id":"653456","tmc_nums":"1","tmcs":[{"distance":72,"status":0}]},{"link_id":"11904900","mesh":"H51F021001","road_id":"654750","tmc_nums":"1","tmcs":[{"distance":321,"status":0}]},{"link_id":"11906244","mesh":"H51F021001","road_id":"627727","tmc_nums":"1","tmcs":[{"distance":77,"status":0}]}]},{"area":"","turn":"7","direction":"0","distance":"1933","duration":"180","path":"120.0426,30.286098;120.04228,30.28602;120.041374,30.285772;120.04001,30.285395;120.03842,30.284973;120.036064,30.28434;120.03566,30.284227;120.03186,30.283194;120.03047,30.282812;120.030106,30.282717;120.02998,30.282686;120.02976,30.282625;120.02811,30.282179;120.02734,30.281975;120.026405,30.281713;120.02431,30.281141;120.02332,30.28089","instruction":"文一西路","drive_instruction":"沿文一西路向西行驶1933米左转","stepOriginLocation":{"lng":"120.0426","lat":"30.286098"},"stepDestinationLocation":{"lng":"120.02332","lat":"30.28089"},"pois":"","ispasspoi":"0","links":[{"link_id":"11894236","mesh":"H51F021001","road_id":"630744","tmc_nums":"1","tmcs":[{"distance":263,"status":0}]},{"link_id":"11896580","mesh":"H51F021001","road_id":"654972","tmc_nums":"1","tmcs":[{"distance":439,"status":0}]},{"link_id":"11889592","mesh":"H51F021001","road_id":"7753","tmc_nums":"1","tmcs":[{"distance":383,"status":0}]},{"link_id":"12110800","mesh":"H51F021001","road_id":"10398","tmc_nums":"1","tmcs":[{"distance":177,"status":0}]},{"link_id":"12111244","mesh":"H51F021001","road_id":"655280","tmc_nums":"1","tmcs":[{"distance":201,"status":0}]},{"link_id":"12111560","mesh":"H51F021001","road_id":"655281","tmc_nums":"1","tmcs":[{"distance":171,"status":0}]},{"link_id":"12112284","mesh":"H51F021001","road_id":"651188","tmc_nums":"1","tmcs":[{"distance":212,"status":0}]},{"link_id":"12124348","mesh":"H51F021001","road_id":"654945","tmc_nums":"1","tmcs":[{"distance":98,"status":0}]}]},{"area":"","turn":"7","direction":"0","distance":"72","duration":"60","path":"120.02325,30.280682;120.02334,30.280304;120.0234,30.280157;120.02342,30.280087;120.02344,30.280039","instruction":"无名道路","drive_instruction":"沿无名道路向南行驶72米左转","stepOriginLocation":{"lng":"120.02325","lat":"30.280682"},"stepDestinationLocation":{"lng":"120.02344","lat":"30.280039"},"pois":"","ispasspoi":"0","links":[{"link_id":"12123052","mesh":"H51F021001","road_id":"10305","tmc_nums":"1","tmcs":[{"distance":43,"status":0}]},{"link_id":"12123188","mesh":"H51F021001","road_id":"10306","tmc_nums":"1","tmcs":[{"distance":17,"status":0}]},{"link_id":"12123300","mesh":"H51F021001","road_id":"631413","tmc_nums":"1","tmcs":[{"distance":7,"status":0}]},{"link_id":"12122804","mesh":"H51F021001","road_id":"655059","tmc_nums":"1","tmcs":[{"distance":5,"status":0}]}]},{"area":"","turn":"3","direction":"0","distance":"90","duration":"60","path":"120.02344,30.280035;120.02434,30.280287","instruction":"无名道路","drive_instruction":"沿无名道路向东行驶90米右转","stepOriginLocation":{"lng":"120.02344","lat":"30.280035"},"stepDestinationLocation":{"lng":"120.02434","lat":"30.280287"},"pois":"","ispasspoi":"0","links":[{"link_id":"12123412","mesh":"H51F021001","road_id":"655061","tmc_nums":"1","tmcs":[{"distance":90,"status":0}]}]},{"area":"","turn":"3","direction":"0","distance":"105","duration":"60","path":"120.02434,30.280287;120.02441,30.28011;120.02465,30.279379","instruction":"无名道路","drive_instruction":"沿无名道路向南行驶105米右转","stepOriginLocation":{"lng":"120.02434","lat":"30.280287"},"stepDestinationLocation":{"lng":"120.02465","lat":"30.279379"},"pois":"","ispasspoi":"0","links":[{"link_id":"12124016","mesh":"H51F021001","road_id":"36574","tmc_nums":"1","tmcs":[{"distance":21,"status":0}]},{"link_id":"12123792","mesh":"H51F021001","road_id":"36575","tmc_nums":"1","tmcs":[{"distance":84,"status":0}]}]},{"area":"","turn":"0","direction":"0","distance":"63","duration":"60","path":"120.02465,30.279375;120.024025,30.279188","instruction":"无名道路","drive_instruction":"沿无名道路向西行驶63米到达目的地","stepOriginLocation":{"lng":"120.02465","lat":"30.279375"},"stepDestinationLocation":{"lng":"120.024025","lat":"30.279188"},"pois":"","ispasspoi":"0","links":[{"link_id":"12117860","mesh":"H51F021001","road_id":"11528","tmc_nums":"1","tmcs":[{"distance":63,"status":0}]}]}],"toll":0,"originLocation":{"lng":"120.134762","lat":"30.236212"}}],"traffic_condition":"","origin":{"uid":"","originPt":{"lng":"120.134762","lat":"30.236212"},"cname":"","area_id":"","wd":""},"destination":{"uid":"","destinationPt":{"lng":"120.023958","lat":"30.279350"},"cname":"","area_id":"","wd":""},"taxi":""},"message":"ok","type":"2","status":"0","info":"copyright:@mapabc"}';
      const infoObj = JSON.parse(data) || {};
      if (code === 200) {
        yield put({
          type: 'saveCarRoute',
          payload: {
            carRoute: { result: infoObj.result, startEndMidway: payload },
            index: payload.index,
            total: payload.total,
          }
        })
      }
      return { code, data: infoObj};
    },
    *filterCarRoute({ payload }, { put, call }) {
      yield put({
        type: 'saveCarRoute',
        payload: {
          total: payload.total,
        }
      })
    },
    *setLayerVisibility({ payload }, { put, call }) {
      yield put({
        type: 'saveLayerVisibility',
        payload: {
          setLayerVisibilityFn: payload.setLayerVisibility,
        }
      })
    },
    *getLayersData({ payload }, { put, call }) {
      const { code, data } = yield call(getLayersData, payload);
      if (code === 200) {
        yield put({
          type: 'saveLayersData',
          payload: {
            layersData: data,
          }
        });
      }
    },
    *getBaseInfoStat({ payload }, { put, call }) {
      const { code, data } = yield call(getBaseInfoStat, payload);
      if (code === 200) {
        yield put({
          type: 'saveBaseInfoStat',
          payload: {
            baseInfoStat: data,
          }
        });
      }
    },
    *resizeMap({ payload }, { put, call }) {
      yield put({
        type: 'saveResizeMap',
        payload: {
          resizeMapFn: payload.resizeMap
        }
      })
    },
    *distanceToStart({ payload }, { put, call }) {
      yield put({
        type: 'saveDistanceToStart',
        payload: {
          distanceToStartFn: payload.distanceToStart
        }
      })
    },
    *getLengthFromRoutesAB({ payload }, { put, call }) {
      yield put({
        type: 'save',
        payload: {
          getLengthFromRoutesAB: payload.getLengthFromRoutesAB
        }
      })
    },
  },
  reducers: {
    save(state,{payload}){
      return {
        ...state,
        ...payload,
      }
    },
    saveControlArea (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveCloseIconData (state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveCarRoute(state, { payload }) {
      const { total, index, carRoute } = payload;
      let { carRouteList } = state;
      carRouteList = carRouteList.map((item, index) => {
        if (index >= total) {
          item = null;
        }
        return item;
      });
      if (Number.isFinite(index) && carRoute) {
        carRouteList[index] = carRoute;
      }
      return {
        ...state,
        carRouteList,
      }
    },
    savaStartEndMidway(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveLayerVisibility(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveLayersData(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveBaseInfoStat(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveResizeMap(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    saveDistanceToStart(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
};
