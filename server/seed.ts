import "dotenv/config";
import { db } from "./db";
import { malls } from "@shared/schema";

// イオンモール一覧データ（2025年1月時点 公式サイトより）
// 追加・削除がしやすいように配列形式で管理
const mallsData = [
  // 北海道
  { id: 1, name: "イオンモール旭川駅前", prefecture: "北海道", region: "北海道", address: "北海道旭川市宮下通7丁目2番5号", openingDate: "2015-03-27", displayDate: "2015年3月" },
  
  // 東北  
  { id: 2, name: "イオンモールつがる柏", prefecture: "青森県", region: "東北", address: "青森県つがる市柏稲盛幾世41", openingDate: "2016-04-29", displayDate: "2016年4月" },
  { id: 3, name: "イオンモール下田", prefecture: "青森県", region: "東北", address: "青森県上北郡おいらせ町中野平40番地1", openingDate: "2006-10-27", displayDate: "2006年10月" },
  { id: 4, name: "イオンモール盛岡", prefecture: "岩手県", region: "東北", address: "岩手県盛岡市前潟4丁目7番1号", openingDate: "2008-12-04", displayDate: "2008年12月" },
  { id: 5, name: "イオンモール盛岡南", prefecture: "岩手県", region: "東北", address: "岩手県盛岡市本宮7丁目1番1号", openingDate: "2011-04-29", displayDate: "2011年4月" },
  { id: 6, name: "イオンモール仙台上杉", prefecture: "宮城県", region: "東北", address: "宮城県仙台市青葉区上杉1丁目2番1号", openingDate: "2024-11-08", displayDate: "2024年11月" },
  { id: 7, name: "イオンモール名取", prefecture: "宮城県", region: "東北", address: "宮城県名取市杜せきのした5丁目3番地の1", openingDate: "2008-03-07", displayDate: "2008年3月" },
  { id: 8, name: "イオンモール新利府", prefecture: "宮城県", region: "東北", address: "宮城県宮城郡利府町新中道3丁目1番地1", openingDate: "2019-04-19", displayDate: "2019年4月" },
  { id: 9, name: "イオンモール富谷", prefecture: "宮城県", region: "東北", address: "宮城県富谷市大清水1丁目33番地1", openingDate: "2016-10-21", displayDate: "2016年10月" },
  { id: 10, name: "イオンモール石巻", prefecture: "宮城県", region: "東北", address: "宮城県石巻市茜平四丁目104番地", openingDate: "2013-11-29", displayDate: "2013年11月" },
  { id: 11, name: "イオンモール秋田", prefecture: "秋田県", region: "東北", address: "秋田県秋田市御所野地蔵田1丁目1番1号", openingDate: "2015-03-27", displayDate: "2015年3月" },
  { id: 12, name: "イオンモール大曲", prefecture: "秋田県", region: "東北", address: "秋田県大仙市和合字坪立177番地", openingDate: "2012-03-16", displayDate: "2012年3月" },
  { id: 13, name: "秋田オーパ", prefecture: "秋田県", region: "東北", address: "秋田県秋田市千秋久保田町4番2号", openingDate: "1992-10-01", displayDate: "1992年10月" },
  { id: 14, name: "イオンモール山形南", prefecture: "山形県", region: "東北", address: "山形県山形市若宮3丁目7番8号", openingDate: "2009-04-24", displayDate: "2009年4月" },
  { id: 15, name: "イオンモール天童", prefecture: "山形県", region: "東北", address: "山形県天童市芳賀タウン北4丁目1番1号", openingDate: "2014-06-27", displayDate: "2014年6月" },
  { id: 16, name: "イオンモール三川", prefecture: "山形県", region: "東北", address: "山形県東田川郡三川町大字猪子字和田庫128番地1", openingDate: "2014-11-28", displayDate: "2014年11月" },
  { id: 17, name: "イオンモールいわき小名浜", prefecture: "福島県", region: "東北", address: "福島県いわき市小名浜字辰巳町79番地", openingDate: "2018-11-30", displayDate: "2018年11月" },

  // 関東
  { id: 18, name: "イオンモール水戸内原", prefecture: "茨城県", region: "関東", address: "茨城県水戸市中原町字西135番地", openingDate: "2008-10-29", displayDate: "2008年10月" },
  { id: 19, name: "イオンモールつくば", prefecture: "茨城県", region: "関東", address: "茨城県つくば市稲岡66番地1", openingDate: "2013-10-31", displayDate: "2013年10月" },
  { id: 20, name: "イオンモール下妻", prefecture: "茨城県", region: "関東", address: "茨城県下妻市堀篭972番地1", openingDate: "2015-11-20", displayDate: "2015年11月" },
  { id: 21, name: "イオンモール土浦", prefecture: "茨城県", region: "関東", address: "茨城県土浦市上高津367番地", openingDate: "2009-10-23", displayDate: "2009年10月" },
  { id: 22, name: "水戸オーパ", prefecture: "茨城県", region: "関東", address: "茨城県水戸市宮町1丁目7番33号", openingDate: "1998-10-01", displayDate: "1998年10月" },
  { id: 23, name: "イオンモール佐野新都市", prefecture: "栃木県", region: "関東", address: "栃木県佐野市高萩町1324番地1", openingDate: "2014-10-24", displayDate: "2014年10月" },
  { id: 24, name: "イオンモール太田", prefecture: "群馬県", region: "関東", address: "群馬県太田市石原町81番地", openingDate: "2017-11-17", displayDate: "2017年11月" },
  { id: 25, name: "イオンモール高崎", prefecture: "群馬県", region: "関東", address: "群馬県高崎市棟高町1400番地", openingDate: "2017-06-09", displayDate: "2017年6月" },
  { id: 26, name: "高崎オーパ", prefecture: "群馬県", region: "関東", address: "群馬県高崎市八島町222", openingDate: "1998-10-01", displayDate: "1998年10月" },
  { id: 27, name: "イオンモール与野", prefecture: "埼玉県", region: "関東", address: "埼玉県さいたま市中央区本町西5丁目2番9号", openingDate: "2012-11-23", displayDate: "2012年11月" },
  { id: 28, name: "イオンモール浦和美園", prefecture: "埼玉県", region: "関東", address: "埼玉県さいたま市緑区大字大門3710番地", openingDate: "2015-04-17", displayDate: "2015年4月" },
  { id: 29, name: "イオンモール川口前川", prefecture: "埼玉県", region: "関東", address: "埼玉県川口市前川1丁目1番地11", openingDate: "2009-03-06", displayDate: "2009年3月" },
  { id: 30, name: "イオンモール川口", prefecture: "埼玉県", region: "関東", address: "埼玉県川口市安行領根岸3180番地", openingDate: "2011-11-25", displayDate: "2011年11月" },
  { id: 31, name: "イオンモール羽生", prefecture: "埼玉県", region: "関東", address: "埼玉県羽生市川崎2丁目281番地3", openingDate: "2007-11-23", displayDate: "2007年11月" },
  { id: 32, name: "イオンレイクタウンkaze", prefecture: "埼玉県", region: "関東", address: "埼玉県越谷市レイクタウン4丁目2番地2", openingDate: "2008-10-02", displayDate: "2008年10月" },
  { id: 33, name: "イオンレイクタウンmori", prefecture: "埼玉県", region: "関東", address: "埼玉県越谷市レイクタウン3丁目1番地1", openingDate: "2008-10-02", displayDate: "2008年10月" },
  { id: 34, name: "イオンレイクタウンアウトレット", prefecture: "埼玉県", region: "関東", address: "埼玉県越谷市レイクタウン4丁目1番地1", openingDate: "2008-10-02", displayDate: "2008年10月" },
  { id: 35, name: "イオンモール春日部", prefecture: "埼玉県", region: "関東", address: "埼玉県春日部市下柳420番地1", openingDate: "2017-05-19", displayDate: "2017年5月" },
  { id: 36, name: "イオンモール北戸田", prefecture: "埼玉県", region: "関東", address: "埼玉県戸田市美女木東1丁目3番地1", openingDate: "2015-11-20", displayDate: "2015年11月" },
  { id: 37, name: "イオンモール上尾", prefecture: "埼玉県", region: "関東", address: "埼玉県上尾市愛宕3丁目8番1号", openingDate: "2015-04-17", displayDate: "2015年4月" },
  { id: 38, name: "イオンモール幕張新都心", prefecture: "千葉県", region: "関東", address: "千葉県千葉市美浜区豊砂1番1号", openingDate: "2013-12-20", displayDate: "2013年12月" },
  { id: 39, name: "イオンモール富津", prefecture: "千葉県", region: "関東", address: "千葉県富津市青木1丁目5番地1", openingDate: "2013-11-29", displayDate: "2013年11月" },
  { id: 40, name: "イオンモール成田", prefecture: "千葉県", region: "関東", address: "千葉県成田市ウイング土屋24番地", openingDate: "2007-04-20", displayDate: "2007年4月" },
  { id: 41, name: "イオンモール千葉ニュータウン", prefecture: "千葉県", region: "関東", address: "千葉県印西市中央北3丁目2番地", openingDate: "2006-10-27", displayDate: "2006年10月" },
  { id: 42, name: "イオンモール木更津", prefecture: "千葉県", region: "関東", address: "千葉県木更津市築地1番地4", openingDate: "2014-10-24", displayDate: "2014年10月" },
  { id: 43, name: "イオンモール八千代緑が丘", prefecture: "千葉県", region: "関東", address: "千葉県八千代市緑が丘2丁目1番3号", openingDate: "2015-11-20", displayDate: "2015年11月" },
  { id: 44, name: "イオンモール柏", prefecture: "千葉県", region: "関東", address: "千葉県柏市豊町2丁目5番25号", openingDate: "2006-10-27", displayDate: "2006年10月" },
  { id: 45, name: "イオンモール銚子", prefecture: "千葉県", region: "関東", address: "千葉県銚子市三崎町2丁目2660番地1", openingDate: "2017-12-01", displayDate: "2017年12月" },
  { id: 46, name: "イオンモール船橋", prefecture: "千葉県", region: "関東", address: "千葉県船橋市山手1丁目1番8号", openingDate: "2007-03-02", displayDate: "2007年3月" },
  { id: 47, name: "イオンモールむさし村山", prefecture: "東京都", region: "関東", address: "東京都武蔵村山市榎1丁目1番地3", openingDate: "2006-11-24", displayDate: "2006年11月" },
  { id: 48, name: "イオンモール日の出", prefecture: "東京都", region: "関東", address: "東京都西多摩郡日の出町大字平井字三吉野桜木237番地3", openingDate: "2007-11-23", displayDate: "2007年11月" },
  { id: 49, name: "イオンモール多摩平の森", prefecture: "東京都", region: "関東", address: "東京都日野市多摩平2丁目4番1号", openingDate: "2014-11-28", displayDate: "2014年11月" },
  { id: 50, name: "イオンモール東久留米", prefecture: "東京都", region: "関東", address: "東京都東久留米市南沢5丁目17番62号", openingDate: "2017-04-21", displayDate: "2017年4月" },
  { id: 51, name: "JIYUGAOKA de aone", prefecture: "東京都", region: "関東", address: "東京都目黒区自由が丘2丁目8番18号", openingDate: "2019-11-28", displayDate: "2019年11月" },
  { id: 52, name: "八王子オーパ", prefecture: "東京都", region: "関東", address: "東京都八王子市旭町9番1号", openingDate: "2006-11-17", displayDate: "2006年11月" },
  { id: 53, name: "CeeU Yokohama", prefecture: "神奈川県", region: "関東", address: "神奈川県横浜市神奈川区金港町1番7号", openingDate: "2022-06-10", displayDate: "2022年6月" },
  { id: 54, name: "イオンモール大和", prefecture: "神奈川県", region: "関東", address: "神奈川県大和市下鶴間1丁目2番1号", openingDate: "2007-10-19", displayDate: "2007年10月" },
  { id: 55, name: "イオンモール座間", prefecture: "神奈川県", region: "関東", address: "神奈川県座間市広野台2丁目10番4号", openingDate: "2017-10-27", displayDate: "2017年10月" },
  { id: 56, name: "THE OUTLETS SHONAN HIRATSUKA", prefecture: "神奈川県", region: "関東", address: "神奈川県平塚市大神明ケ谷605", openingDate: "2016-04-28", displayDate: "2016年4月" },
  { id: 57, name: "新百合丘オーパ", prefecture: "神奈川県", region: "関東", address: "神奈川県川崎市麻生区上麻生1丁目1番1号", openingDate: "2007-04-01", displayDate: "2007年4月" },
  { id: 58, name: "湘南藤沢オーパ", prefecture: "神奈川県", region: "関東", address: "神奈川県藤沢市藤沢555番1号", openingDate: "1997-11-01", displayDate: "1997年11月" },
  { id: 59, name: "横浜ビブレ", prefecture: "神奈川県", region: "関東", address: "神奈川県横浜市西区南幸2丁目15番13号", openingDate: "1976-10-01", displayDate: "1976年10月" },
  { id: 60, name: "横浜ワールドポーターズ", prefecture: "神奈川県", region: "関東", address: "神奈川県横浜市中区新港2丁目2番1号", openingDate: "1999-09-01", displayDate: "1999年9月" },

  // 中部
  { id: 61, name: "イオンモール新潟亀田インター", prefecture: "新潟県", region: "中部", address: "新潟県新潟市江南区鵜ノ子4丁目466番地", openingDate: "2024-10-25", displayDate: "2024年10月" },
  { id: 62, name: "イオンモール高岡", prefecture: "富山県", region: "中部", address: "富山県高岡市下伏間江383番地", openingDate: "2015-03-13", displayDate: "2015年3月" },
  { id: 63, name: "イオンモールとなみ", prefecture: "富山県", region: "中部", address: "富山県砺波市中神1丁目174番地", openingDate: "2015-04-24", displayDate: "2015年4月" },
  { id: 64, name: "イオンモールかほく", prefecture: "石川県", region: "中部", address: "石川県かほく市内日角タ25番地", openingDate: "2015-03-13", displayDate: "2015年3月" },
  { id: 65, name: "イオンモール新小松", prefecture: "石川県", region: "中部", address: "石川県小松市清六町315番地", openingDate: "2017-03-17", displayDate: "2017年3月" },
  { id: 66, name: "イオンモール白山", prefecture: "石川県", region: "中部", address: "石川県白山市横江町土地区画整理事業施行地区内1街区", openingDate: "2015-04-24", displayDate: "2015年4月" },
  { id: 67, name: "金沢フォーラス", prefecture: "石川県", region: "中部", address: "石川県金沢市堀川新町3番1号", openingDate: "2006-09-23", displayDate: "2006年9月" },
  { id: 68, name: "イオンモール甲府昭和", prefecture: "山梨県", region: "中部", address: "山梨県中巨摩郡昭和町飯喰1505番地1", openingDate: "2017-03-03", displayDate: "2017年3月" },
  { id: 69, name: "イオンモール佐久平", prefecture: "長野県", region: "中部", address: "長野県佐久市佐久平駅南11番地10", openingDate: "2014-11-28", displayDate: "2014年11月" },
  { id: 70, name: "イオンモール松本", prefecture: "長野県", region: "中部", address: "長野県松本市中央4丁目9番51号", openingDate: "2017-11-17", displayDate: "2017年11月" },
  { id: 71, name: "イオンモール須坂", prefecture: "長野県", region: "中部", address: "長野県須坂市仁礼町峰の原1051番地", openingDate: "2023-04-21", displayDate: "2023年4月" },
  { id: 72, name: "イオンモール大垣", prefecture: "岐阜県", region: "中部", address: "岐阜県大垣市外野2丁目100番地", openingDate: "2012-03-16", displayDate: "2012年3月" },
  { id: 73, name: "イオンモール各務原インター", prefecture: "岐阜県", region: "中部", address: "岐阜県各務原市鵜沼各務原町8丁目7番地", openingDate: "2024-11-15", displayDate: "2024年11月" },
  { id: 74, name: "イオンモール土岐", prefecture: "岐阜県", region: "中部", address: "岐阜県土岐市土岐ヶ丘2丁目5番地", openingDate: "2015-04-24", displayDate: "2015年4月" },
  { id: 75, name: "イオンモール浜松志都呂", prefecture: "静岡県", region: "中部", address: "静岡県浜松市西区志都呂2丁目37番1号", openingDate: "2007-10-19", displayDate: "2007年10月" },
  { id: 76, name: "イオンモール浜松市野", prefecture: "静岡県", region: "中部", address: "静岡県浜松市東区天王町字諏訪1981番地3", openingDate: "2010-11-26", displayDate: "2010年11月" },
  { id: 77, name: "イオンモール富士宮", prefecture: "静岡県", region: "中部", address: "静岡県富士宮市浅間町1番8号", openingDate: "2010-11-26", displayDate: "2010年11月" },
  { id: 78, name: "イオンモール熱田", prefecture: "愛知県", region: "中部", address: "愛知県名古屋市熱田区六野1丁目2番11号", openingDate: "2014-12-05", displayDate: "2014年12月" },
  { id: 79, name: "イオンモールナゴヤドーム前", prefecture: "愛知県", region: "中部", address: "愛知県名古屋市東区矢田南4丁目102番地3", openingDate: "2013-03-15", displayDate: "2013年3月" },
  { id: 80, name: "イオンモール大高", prefecture: "愛知県", region: "中部", address: "愛知県名古屋市緑区南大高2丁目450番地", openingDate: "2010-11-26", displayDate: "2010年11月" },
  { id: 81, name: "イオンモール新瑞橋", prefecture: "愛知県", region: "中部", address: "愛知県名古屋市南区新瑞橋通1丁目5番地2", openingDate: "2012-11-23", displayDate: "2012年11月" },
  { id: 82, name: "イオンモール名古屋茶屋", prefecture: "愛知県", region: "中部", address: "愛知県名古屋市港区西茶屋2丁目11番地", openingDate: "2008-03-07", displayDate: "2008年3月" },
  { id: 83, name: "Nagoya Noritake Garden", prefecture: "愛知県", region: "中部", address: "愛知県名古屋市西区則武新町3丁目1番17号", openingDate: "2021-09-17", displayDate: "2021年9月" },
  { id: 84, name: "BIZrium名古屋", prefecture: "愛知県", region: "中部", address: "愛知県名古屋市中村区平池町4丁目60番地12", openingDate: "2021-10-29", displayDate: "2021年10月" },
  { id: 85, name: "イオンモール豊川", prefecture: "愛知県", region: "中部", address: "愛知県豊川市開運通2丁目31番地", openingDate: "2008-10-24", displayDate: "2008年10月" },
  { id: 86, name: "イオンモール岡崎", prefecture: "愛知県", region: "中部", address: "愛知県岡崎市戸崎町字外山38番地5", openingDate: "2007-11-23", displayDate: "2007年11月" },
  { id: 87, name: "イオンモール東浦", prefecture: "愛知県", region: "中部", address: "愛知県知多郡東浦町大字緒川字旭13番地2", openingDate: "2015-12-04", displayDate: "2015年12月" },
  { id: 88, name: "イオンモール木曽川", prefecture: "愛知県", region: "中部", address: "愛知県一宮市木曽川町黒田字南八ツケ池25番地1", openingDate: "2014-06-27", displayDate: "2014年6月" },
  { id: 89, name: "イオンモール常滑", prefecture: "愛知県", region: "中部", address: "愛知県常滑市りんくう町2丁目20番地3", openingDate: "2015-12-04", displayDate: "2015年12月" },
  { id: 90, name: "イオンモール長久手", prefecture: "愛知県", region: "中部", address: "愛知県長久手市長久手中央土地区画整理事業地内5・10・11街区", openingDate: "2012-11-23", displayDate: "2012年11月" },
  { id: 91, name: "イオンモール扶桑", prefecture: "愛知県", region: "中部", address: "愛知県丹羽郡扶桑町大字南山名字高塚5番地1", openingDate: "2015-03-13", displayDate: "2015年3月" },
  { id: 92, name: "mozo wondercity", prefecture: "愛知県", region: "中部", address: "愛知県名古屋市西区二方町40番地", openingDate: "2005-10-25", displayDate: "2005年10月" },
  { id: 93, name: "名古屋mozoオーパ", prefecture: "愛知県", region: "中部", address: "愛知県名古屋市西区二方町40番", openingDate: "2005-10-25", displayDate: "2005年10月" },
  { id: 94, name: "イオンモール津南", prefecture: "三重県", region: "中部", address: "三重県津市高茶屋小森町145番地", openingDate: "2006-10-27", displayDate: "2006年10月" },
  { id: 95, name: "イオンモール鈴鹿", prefecture: "三重県", region: "中部", address: "三重県鈴鹿市庄野羽山4丁目1番2号", openingDate: "2003-11-21", displayDate: "2003年11月" },
  { id: 96, name: "イオンモール東員", prefecture: "三重県", region: "中部", address: "三重県員弁郡東員町大字長深字築田510番地1", openingDate: "2013-12-06", displayDate: "2013年12月" },
  { id: 97, name: "イオンモール四日市北", prefecture: "三重県", region: "中部", address: "三重県四日市市富州原町2番40号", openingDate: "2008-03-07", displayDate: "2008年3月" },
  { id: 98, name: "イオンモール明和", prefecture: "三重県", region: "中部", address: "三重県多気郡明和町中村1223番地", openingDate: "2014-03-07", displayDate: "2014年3月" },
  { id: 99, name: "イオンモール桑名", prefecture: "三重県", region: "中部", address: "三重県桑名市新西方1丁目22番地", openingDate: "2015-04-17", displayDate: "2015年4月" },

  // 近畿
  { id: 100, name: "イオンモール草津", prefecture: "滋賀県", region: "近畿", address: "滋賀県草津市新浜町300番地", openingDate: "2008-10-24", displayDate: "2008年10月" },
  { id: 101, name: "イオンモール京都五条", prefecture: "京都府", region: "近畿", address: "京都府京都市右京区西院追分町25番地1", openingDate: "2010-11-26", displayDate: "2010年11月" },
  { id: 102, name: "イオンモールKYOTO", prefecture: "京都府", region: "近畿", address: "京都府京都市南区西九条鳥居口町1番地", openingDate: "2010-04-23", displayDate: "2010年4月" },
  { id: 103, name: "イオンモール京都桂川", prefecture: "京都府", region: "近畿", address: "京都府京都市南区久世高田町376番地1", openingDate: "2014-10-17", displayDate: "2014年10月" },
  { id: 104, name: "イオンモール北大路", prefecture: "京都府", region: "近畿", address: "京都府京都市北区小山北上総町49番地1", openingDate: "2023-04-21", displayDate: "2023年4月" },
  { id: 105, name: "イオンモール久御山", prefecture: "京都府", region: "近畿", address: "京都府久世郡久御山町森南大内156番地1", openingDate: "2014-10-17", displayDate: "2014年10月" },
  { id: 106, name: "イオンモール高の原", prefecture: "京都府", region: "近畿", address: "京都府木津川市相楽台1丁目1番地1", openingDate: "2017-11-17", displayDate: "2017年11月" },
  { id: 107, name: "河原町オーパ", prefecture: "京都府", region: "近畿", address: "京都府京都市中京区河原町通四条上る米屋町382番地1", openingDate: "1987-10-01", displayDate: "1987年10月" },
  { id: 108, name: "イオンモール鶴見緑地", prefecture: "大阪府", region: "近畿", address: "大阪府大阪市鶴見区鶴見4丁目17番1号", openingDate: "2007-03-02", displayDate: "2007年3月" },
  { id: 109, name: "イオンモール堺北花田", prefecture: "大阪府", region: "近畿", address: "大阪府堺市北区東浅香山町4丁1番12号", openingDate: "2004-11-26", displayDate: "2004年11月" },
  { id: 110, name: "イオンモール堺鉄砲町", prefecture: "大阪府", region: "近畿", address: "大阪府堺市堺区鉄砲町1番地", openingDate: "2009-03-13", displayDate: "2009年3月" },
  { id: 111, name: "イオンモールりんくう泉南", prefecture: "大阪府", region: "近畿", address: "大阪府泉南市りんくう南浜3番地12", openingDate: "2000-09-01", displayDate: "2000年9月" },
  { id: 112, name: "イオンモール四條畷", prefecture: "大阪府", region: "近畿", address: "大阪府四條畷市砂四丁目3番2号", openingDate: "2015-10-23", displayDate: "2015年10月" },
  { id: 113, name: "イオンモール日根野", prefecture: "大阪府", region: "近畿", address: "大阪府泉佐野市日根野2496番地1", openingDate: "2008-10-24", displayDate: "2008年10月" },
  { id: 114, name: "イオンモール大日", prefecture: "大阪府", region: "近畿", address: "大阪府守口市大日東町1番18号", openingDate: "2007-03-02", displayDate: "2007年3月" },
  { id: 115, name: "イオンモール茨木", prefecture: "大阪府", region: "近畿", address: "大阪府茨木市松ヶ本町8番30号地の2", openingDate: "2013-11-22", displayDate: "2013年11月" },
  { id: 116, name: "イオンモールSENRITO専門館", prefecture: "大阪府", region: "近畿", address: "大阪府豊中市新千里東町1丁目5番2号", openingDate: "2023-04-21", displayDate: "2023年4月" },
  { id: 117, name: "藤井寺ショッピングセンター", prefecture: "大阪府", region: "近畿", address: "大阪府藤井寺市岡2丁目10番11号", openingDate: "1992-10-01", displayDate: "1992年10月" },
  { id: 118, name: "心斎橋オーパ", prefecture: "大阪府", region: "近畿", address: "大阪府大阪市中央区西心斎橋1丁目4番3号", openingDate: "1984-10-01", displayDate: "1984年10月" },
  { id: 119, name: "心斎橋オーパきれい館", prefecture: "大阪府", region: "近畿", address: "大阪府大阪市中央区西心斎橋1丁目5番24号", openingDate: "2013-10-01", displayDate: "2013年10月" },
  { id: 120, name: "イオンモール神戸北", prefecture: "兵庫県", region: "近畿", address: "兵庫県神戸市北区上津台8丁目1番1号", openingDate: "2006-10-27", displayDate: "2006年10月" },
  { id: 121, name: "イオンモール神戸南", prefecture: "兵庫県", region: "近畿", address: "兵庫県神戸市兵庫区中之島2丁目1番1号", openingDate: "2007-10-19", displayDate: "2007年10月" },
  { id: 122, name: "イオンモール伊丹", prefecture: "兵庫県", region: "近畿", address: "兵庫県伊丹市池尻4丁目1番地1", openingDate: "2009-04-24", displayDate: "2009年4月" },
  { id: 123, name: "イオンモール伊丹昆陽", prefecture: "兵庫県", region: "近畿", address: "兵庫県伊丹市池尻4丁目1番地1", openingDate: "2010-04-23", displayDate: "2010年4月" },
  { id: 124, name: "イオンモール姫路リバーシティー", prefecture: "兵庫県", region: "近畿", address: "兵庫県姫路市飾磨区細江2560番地", openingDate: "2002-11-22", displayDate: "2002年11月" },
  { id: 125, name: "イオンモール姫路大津", prefecture: "兵庫県", region: "近畿", address: "兵庫県姫路市大津区大津町2丁目5番地", openingDate: "2014-10-17", displayDate: "2014年10月" },
  { id: 126, name: "イオンモール加西北条", prefecture: "兵庫県", region: "近畿", address: "兵庫県加西市北条町北条308番地の1", openingDate: "2009-04-24", displayDate: "2009年4月" },
  { id: 127, name: "明石ショッピングセンター", prefecture: "兵庫県", region: "近畿", address: "兵庫県明石市大久保町ゆりのき通り1丁目2番2号", openingDate: "2000-09-01", displayDate: "2000年9月" },
  { id: 128, name: "神戸ハーバーランドumie", prefecture: "兵庫県", region: "近畿", address: "兵庫県神戸市中央区東川崎町1丁目7番2号", openingDate: "2013-04-18", displayDate: "2013年4月" },
  { id: 129, name: "三宮オーパ", prefecture: "兵庫県", region: "近畿", address: "兵庫県神戸市中央区雲井通7丁目1番1号", openingDate: "1995-10-01", displayDate: "1995年10月" },
  { id: 130, name: "三宮オーパ2", prefecture: "兵庫県", region: "近畿", address: "兵庫県神戸市中央区三宮町1丁目5番26号", openingDate: "2017-03-01", displayDate: "2017年3月" },
  { id: 131, name: "明石ビブレ", prefecture: "兵庫県", region: "近畿", address: "兵庫県明石市大明石町1丁目6番1号", openingDate: "1992-10-01", displayDate: "1992年10月" },
  { id: 132, name: "イオンモール橿原", prefecture: "奈良県", region: "近畿", address: "奈良県橿原市曲川町7丁目20番1号", openingDate: "2010-11-26", displayDate: "2010年11月" },
  { id: 133, name: "イオンモール大和郡山", prefecture: "奈良県", region: "近畿", address: "奈良県大和郡山市下三橋町741番地", openingDate: "2006-10-27", displayDate: "2006年10月" },
  { id: 134, name: "イオンモール奈良登美ヶ丘", prefecture: "奈良県", region: "近畿", address: "奈良県生駒市鹿畑町3027番地", openingDate: "2011-11-25", displayDate: "2011年11月" },
  { id: 135, name: "イオンモール和歌山", prefecture: "和歌山県", region: "近畿", address: "和歌山県和歌山市中字楠谷573番地", openingDate: "2014-03-07", displayDate: "2014年3月" },

  // 中国
  { id: 136, name: "イオンモール鳥取北", prefecture: "鳥取県", region: "中国", address: "鳥取県鳥取市晩稲348番地", openingDate: "2010-11-26", displayDate: "2010年11月" },
  { id: 137, name: "イオンモール日吉津", prefecture: "鳥取県", region: "中国", address: "鳥取県西伯郡日吉津村日吉津1160番地1", openingDate: "2000-10-28", displayDate: "2000年10月" },
  { id: 138, name: "イオンモール岡山", prefecture: "岡山県", region: "中国", address: "岡山県岡山市北区下石井1丁目2番1号", openingDate: "2014-12-05", displayDate: "2014年12月" },
  { id: 139, name: "イオンモール倉敷", prefecture: "岡山県", region: "中国", address: "岡山県倉敷市水江1番地", openingDate: "2011-03-18", displayDate: "2011年3月" },
  { id: 140, name: "イオンモール津山", prefecture: "岡山県", region: "中国", address: "岡山県津山市河辺1000番地1", openingDate: "2017-03-03", displayDate: "2017年3月" },
  { id: 141, name: "イオンモール広島祇園", prefecture: "広島県", region: "中国", address: "広島県広島市安佐南区祇園3丁目2番1号", openingDate: "2014-12-05", displayDate: "2014年12月" },
  { id: 142, name: "広島段原ショッピングセンター", prefecture: "広島県", region: "中国", address: "広島県広島市南区段原南1丁目3番52号", openingDate: "2001-10-01", displayDate: "2001年10月" },
  { id: 143, name: "THE OUTLETS HIROSHIMA", prefecture: "広島県", region: "中国", address: "広島県広島市佐伯区石内東4丁目1番1号", openingDate: "2018-04-27", displayDate: "2018年4月" },
  { id: 144, name: "イオンモール広島府中", prefecture: "広島県", region: "中国", address: "広島県安芸郡府中町大須2丁目1番1号", openingDate: "2013-03-15", displayDate: "2013年3月" },

  // 四国
  { id: 145, name: "イオンモール徳島", prefecture: "徳島県", region: "四国", address: "徳島県徳島市南末広町4番1号", openingDate: "2013-03-15", displayDate: "2013年3月" },
  { id: 146, name: "イオンモール高松", prefecture: "香川県", region: "四国", address: "香川県高松市香西本町1番地1", openingDate: "2001-03-16", displayDate: "2001年3月" },
  { id: 147, name: "イオンモール綾川", prefecture: "香川県", region: "四国", address: "香川県綾歌郡綾川町萱原822番地1", openingDate: "2008-03-21", displayDate: "2008年3月" },
  { id: 148, name: "イオンモール新居浜", prefecture: "愛媛県", region: "四国", address: "愛媛県新居浜市前田町8番8号", openingDate: "2015-06-26", displayDate: "2015年6月" },
  { id: 149, name: "イオンモール今治新都市", prefecture: "愛媛県", region: "四国", address: "愛媛県今治市にぎわい広場1番地1", openingDate: "2015-04-24", displayDate: "2015年4月" },
  { id: 150, name: "イオンモール高知", prefecture: "高知県", region: "四国", address: "高知県高知市秦南町1丁目4番8号", openingDate: "2013-03-15", displayDate: "2013年3月" },

  // 九州・沖縄
  { id: 151, name: "イオンモール福岡", prefecture: "福岡県", region: "九州", address: "福岡県糟屋郡粕屋町大字酒殿字老ノ木192番地1", openingDate: "2012-04-27", displayDate: "2012年4月" },
  { id: 152, name: "イオンモール直方", prefecture: "福岡県", region: "九州", address: "福岡県直方市湯野原2丁目1番1号", openingDate: "2012-03-16", displayDate: "2012年3月" },
  { id: 153, name: "イオンモール筑紫野", prefecture: "福岡県", region: "九州", address: "福岡県筑紫野市立明寺434番地1", openingDate: "2011-11-18", displayDate: "2011年11月" },
  { id: 154, name: "イオンモール大牟田", prefecture: "福岡県", region: "九州", address: "福岡県大牟田市岬町3番地4", openingDate: "2011-03-18", displayDate: "2011年3月" },
  { id: 155, name: "イオンモール福津", prefecture: "福岡県", region: "九州", address: "福岡県福津市日蒔野6丁目16番地の1", openingDate: "2012-04-27", displayDate: "2012年4月" },
  { id: 156, name: "イオンモール八幡東", prefecture: "福岡県", region: "九州", address: "福岡県北九州市八幡東区東田3丁目2番102号", openingDate: "2006-11-24", displayDate: "2006年11月" },
  { id: 157, name: "THE OUTLETS KITAKYUSHU", prefecture: "福岡県", region: "九州", address: "福岡県北九州市八幡東区東田4丁目1番1号", openingDate: "2022-04-28", displayDate: "2022年4月" },
  { id: 158, name: "キャナルシティオーパ", prefecture: "福岡県", region: "九州", address: "福岡県福岡市博多区住吉1丁目2番25号", openingDate: "1996-04-20", displayDate: "1996年4月" },
  { id: 159, name: "イオンモール宇城", prefecture: "熊本県", region: "九州", address: "熊本県宇城市小川町河江1番地1", openingDate: "2017-06-23", displayDate: "2017年6月" },
  { id: 160, name: "イオンモール熊本", prefecture: "熊本県", region: "九州", address: "熊本県上益城郡嘉島町大字上島字長池2232番地", openingDate: "2015-04-24", displayDate: "2015年4月" },
  { id: 161, name: "イオンモール三光", prefecture: "大分県", region: "九州", address: "大分県中津市三光佐知1032番地", openingDate: "2011-03-18", displayDate: "2011年3月" },
  { id: 162, name: "大分オーパ", prefecture: "大分県", region: "九州", address: "大分県大分市中央町1丁目3番19号", openingDate: "1994-10-01", displayDate: "1994年10月" },
  { id: 163, name: "イオンモール宮崎", prefecture: "宮崎県", region: "九州", address: "宮崎県宮崎市新別府町江口862番地1", openingDate: "2014-10-31", displayDate: "2014年10月" },
  { id: 164, name: "イオンモール都城駅前", prefecture: "宮崎県", region: "九州", address: "宮崎県都城市栄町4672番地5", openingDate: "2017-11-17", displayDate: "2017年11月" },
  { id: 165, name: "イオンモール沖縄ライカム", prefecture: "沖縄県", region: "沖縄", address: "沖縄県中頭郡北中城村字ライカム1番地", openingDate: "2015-04-25", displayDate: "2015年4月" },
  { id: 166, name: "那覇オーパ", prefecture: "沖縄県", region: "沖縄", address: "沖縄県那覇市国場1029", openingDate: "2015-06-01", displayDate: "2015年6月" },
];

async function seed() {
  console.log("🌱 Seeding database with AEON Mall data...");

  try {
    // Insert all malls data
    for (const mall of mallsData) {
      await db.insert(malls).values(mall).onConflictDoNothing();
      console.log(`✓ Inserted: ${mall.name}`);
    }

    console.log(`\n✅ Successfully seeded ${mallsData.length} AEON Malls!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
