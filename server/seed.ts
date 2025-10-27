import { db } from "./db";
import { malls } from "@shared/schema";

// AEON Mall data for seeding the database
const AEON_MALLS = [
  // Kanto Region
  { id: 1, name: "イオンモール幕張新都心", prefecture: "千葉県", region: "kanto", address: "千葉県千葉市美浜区豊砂1-1", openingDate: "2013-12-20", displayDate: "2013年12月20日" },
  { id: 2, name: "イオンレイクタウンmori", prefecture: "埼玉県", region: "kanto", address: "埼玉県越谷市レイクタウン3-1-1", openingDate: "2008-10-02", displayDate: "2008年10月2日" },
  { id: 3, name: "イオンレイクタウンkaze", prefecture: "埼玉県", region: "kanto", address: "埼玉県越谷市レイクタウン4-2-2", openingDate: "2008-10-02", displayDate: "2008年10月2日" },
  { id: 4, name: "イオンモール成田", prefecture: "千葉県", region: "kanto", address: "千葉県成田市ウイング土屋24", openingDate: "2007-10-01", displayDate: "2007年10月1日" },
  { id: 5, name: "イオンモール土浦", prefecture: "茨城県", region: "kanto", address: "茨城県土浦市上高津367", openingDate: "2011-11-17", displayDate: "2011年11月17日" },
  { id: 6, name: "イオンモール太田", prefecture: "群馬県", region: "kanto", address: "群馬県太田市石原町81", openingDate: "2011-09-01", displayDate: "2011年9月1日" },
  { id: 7, name: "THE OUTLETS 湘南平塚", prefecture: "神奈川県", region: "kanto", address: "神奈川県平塚市大神一之坪605", openingDate: "2016-03-12", displayDate: "2016年3月12日" },
  
  // Chubu Region
  { id: 8, name: "イオンモール常滑", prefecture: "愛知県", region: "chubu", address: "愛知県常滑市りんくう町2-20-3", openingDate: "1998-10-01", displayDate: "1998年10月1日" },
  { id: 9, name: "イオンモール名古屋ドーム前", prefecture: "愛知県", region: "chubu", address: "愛知県名古屋市東区矢田南4-102-3", openingDate: "2017-02-25", displayDate: "2017年2月25日" },
  { id: 10, name: "イオンモール名古屋茶屋", prefecture: "愛知県", region: "chubu", address: "愛知県名古屋市港区西茶屋2-11", openingDate: "2008-10-10", displayDate: "2008年10月10日" },
  { id: 11, name: "イオンモール長久手", prefecture: "愛知県", region: "chubu", address: "愛知県長久手市長湫501", openingDate: "2019-11-08", displayDate: "2019年11月8日" },
  { id: 12, name: "イオンモール各務原", prefecture: "岐阜県", region: "chubu", address: "岐阜県各務原市那加萱場町3-8", openingDate: "2007-11-23", displayDate: "2007年11月23日" },
  { id: 13, name: "イオンモール浜松市野", prefecture: "静岡県", region: "chubu", address: "静岡県浜松市東区天王町字諏訪1981-3", openingDate: "2008-11-07", displayDate: "2008年11月7日" },
  { id: 14, name: "イオンモール白山", prefecture: "石川県", region: "chubu", address: "石川県白山市横江町土地区画整理事業施行地区内1街区", openingDate: "2016-03-01", displayDate: "2016年3月1日" },
  { id: 15, name: "イオンモール新潟南", prefecture: "新潟県", region: "chubu", address: "新潟県新潟市江南区下早通柳田1-1-1", openingDate: "2007-05-03", displayDate: "2007年5月3日" },
  
  // Kinki Region
  { id: 16, name: "イオンモール橿原", prefecture: "奈良県", region: "kinki", address: "奈良県橿原市曲川町7-20-1", openingDate: "2004-04-01", displayDate: "2004年4月1日" },
  { id: 17, name: "イオンモールりんくう泉南", prefecture: "大阪府", region: "kinki", address: "大阪府泉南市りんくう南浜3-12", openingDate: "2000-08-02", displayDate: "2000年8月2日" },
  { id: 18, name: "イオンモール神戸北", prefecture: "兵庫県", region: "kinki", address: "兵庫県神戸市北区上津台8-1-1", openingDate: "2008-10-10", displayDate: "2008年10月10日" },
  { id: 19, name: "イオンモール京都桂川", prefecture: "京都府", region: "kinki", address: "京都府京都市南区久世高田町376-1", openingDate: "2014-10-17", displayDate: "2014年10月17日" },
  { id: 20, name: "umie", prefecture: "兵庫県", region: "kinki", address: "兵庫県神戸市中央区東川崎町1-7-2", openingDate: "2013-04-18", displayDate: "2013年4月18日" },
  
  // Tohoku Region
  { id: 21, name: "イオンモール名取", prefecture: "宮城県", region: "tohoku", address: "宮城県名取市杜せきのした5-3-1", openingDate: "2008-09-20", displayDate: "2008年9月20日" },
  { id: 22, name: "イオンモール盛岡", prefecture: "岩手県", region: "tohoku", address: "岩手県盛岡市前潟4-7-1", openingDate: "2008-03-14", displayDate: "2008年3月14日" },
  { id: 23, name: "イオンモール天童", prefecture: "山形県", region: "tohoku", address: "山形県天童市芳賀タウン北4-1-1", openingDate: "2015-05-27", displayDate: "2015年5月27日" },
  
  // Hokkaido Region
  { id: 24, name: "イオンモール旭川駅前", prefecture: "北海道", region: "hokkaido", address: "北海道旭川市宮下通7丁目2-5", openingDate: "2015-03-28", displayDate: "2015年3月28日" },
  { id: 25, name: "イオンモール札幌発寒", prefecture: "北海道", region: "hokkaido", address: "北海道札幌市西区発寒8条12-1", openingDate: "2004-10-29", displayDate: "2004年10月29日" },
  { id: 26, name: "イオンモール千歳", prefecture: "北海道", region: "hokkaido", address: "北海道千歳市栄町6-51", openingDate: "2015-03-27", displayDate: "2015年3月27日" },
  
  // Chugoku Region
  { id: 27, name: "イオンモール倉敷", prefecture: "岡山県", region: "chugoku", address: "岡山県倉敷市水江1", openingDate: "2011-11-25", displayDate: "2011年11月25日" },
  { id: 28, name: "イオンモール鳥取北", prefecture: "鳥取県", region: "chugoku", address: "鳥取県鳥取市晩稲348", openingDate: "2010-11-19", displayDate: "2010年11月19日" },
  { id: 29, name: "イオンモール日吉津", prefecture: "鳥取県", region: "chugoku", address: "鳥取県西伯郡日吉津村日吉津1160-1", openingDate: "2004-12-03", displayDate: "2004年12月3日" },
  { id: 30, name: "THE OUTLETS HIROSHIMA", prefecture: "広島県", region: "chugoku", address: "広島県広島市佐伯区石内東4-1-1", openingDate: "2018-04-27", displayDate: "2018年4月27日" },
  
  // Shikoku Region
  { id: 31, name: "イオンモール綾川", prefecture: "香川県", region: "shikoku", address: "香川県綾歌郡綾川町萱原822-1", openingDate: "2008-12-05", displayDate: "2008年12月5日" },
  { id: 32, name: "イオンモール高松", prefecture: "香川県", region: "shikoku", address: "香川県高松市香西本町1-1", openingDate: "2007-03-16", displayDate: "2007年3月16日" },
  { id: 33, name: "イオンモール新居浜", prefecture: "愛媛県", region: "shikoku", address: "愛媛県新居浜市前田町8-8", openingDate: "2007-10-26", displayDate: "2007年10月26日" },
  
  // Kyushu Region
  { id: 34, name: "イオンモール福岡", prefecture: "福岡県", region: "kyushu", address: "福岡県糟屋郡粕屋町大字酒殿字老ノ木192-1", openingDate: "2012-12-21", displayDate: "2012年12月21日" },
  { id: 35, name: "THE OUTLETS KITAKYUSHU", prefecture: "福岡県", region: "kyushu", address: "福岡県北九州市八幡東区東田4-1-1", openingDate: "2021-04-16", displayDate: "2021年4月16日" },
  { id: 36, name: "イオンモール宮崎", prefecture: "宮崎県", region: "kyushu", address: "宮崎県宮崎市新別府町江口862-1", openingDate: "2014-10-24", displayDate: "2014年10月24日" },
  { id: 37, name: "イオンモール鹿児島", prefecture: "鹿児島県", region: "kyushu", address: "鹿児島県鹿児島市東開町7", openingDate: "2007-10-19", displayDate: "2007年10月19日" },
  { id: 38, name: "イオンモール熊本", prefecture: "熊本県", region: "kyushu", address: "熊本県上益城郡嘉島町大字上島字長池2232", openingDate: "2012-09-28", displayDate: "2012年9月28日" },
  
  // Okinawa Region
  { id: 39, name: "イオンモール沖縄ライカム", prefecture: "沖縄県", region: "okinawa", address: "沖縄県中頭郡北中城村字ライカム1", openingDate: "2015-04-25", displayDate: "2015年4月25日" },
  { id: 40, name: "イオンモール沖縄", prefecture: "沖縄県", region: "okinawa", address: "沖縄県那覇市金城5-10-2", openingDate: "2008-04-25", displayDate: "2008年4月25日" },
];

export async function seedMalls() {
  console.log("Seeding malls table...");
  
  try {
    for (const mall of AEON_MALLS) {
      await db.insert(malls).values(mall).onConflictDoNothing();
    }
    console.log(`Successfully seeded ${AEON_MALLS.length} malls`);
  } catch (error) {
    console.error("Error seeding malls:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedMalls()
    .then(() => {
      console.log("Seeding complete");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}
