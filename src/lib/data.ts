import { CategoryType, PaymentMethodType } from "./utils"

// ============================================
// TYPES
// ============================================

export interface Family {
  id: string
  familyNo: number
  headOfFamily: string
  houseName: string
  phone: string
  address: string
  members: Member[]
  createdAt: string
}

export interface Member {
  id: string
  memberId: string
  name: string
  familyId: string
  familyNo: number
  houseName: string
  phone: string
  dob: string
  gender: "male" | "female"
  role: string
  avatar?: string
}

export interface Transaction {
  id: string
  date: string
  receiptNo: string
  category: CategoryType
  familyId: string
  familyNo: number
  houseName: string
  memberId?: string
  memberName: string
  description: string
  amount: number
  paymentMethod: PaymentMethodType
  collectedBy: string
  type: "income" | "expense"
  notes?: string
}

export interface Receipt {
  id: string
  receiptNo: string
  date: string
  memberId?: string
  memberName: string
  familyId: string
  familyNo: number
  houseName: string
  category: CategoryType
  amount: number
  amountInWords: string
  paymentMethod: PaymentMethodType
  receivedBy: string
  transactionId: string
}

// ============================================
// FAMILIES & MEMBERS
// ============================================

const familyData: Omit<Family, "members">[] = [
  { id: "f1", familyNo: 100, headOfFamily: "B Reji", houseName: "Rijin Bhavan", phone: "9847012345", address: "Kottayam, Kerala", createdAt: "2020-01-15" },
  { id: "f2", familyNo: 101, headOfFamily: "Thomas Mathew", houseName: "Mathew Villa", phone: "9847023456", address: "Kottayam, Kerala", createdAt: "2020-02-10" },
  { id: "f3", familyNo: 102, headOfFamily: "Joseph Kurian", houseName: "Kurian House", phone: "9847034567", address: "Kottayam, Kerala", createdAt: "2020-03-05" },
  { id: "f4", familyNo: 103, headOfFamily: "George Varghese", houseName: "Varghese Nivas", phone: "9847045678", address: "Kottayam, Kerala", createdAt: "2020-03-20" },
  { id: "f5", familyNo: 104, headOfFamily: "Samuel John", houseName: "John Cottage", phone: "9847056789", address: "Kottayam, Kerala", createdAt: "2020-04-12" },
  { id: "f6", familyNo: 105, headOfFamily: "Abraham Philip", houseName: "Philip Mana", phone: "9847067890", address: "Kottayam, Kerala", createdAt: "2020-05-01" },
  { id: "f7", familyNo: 106, headOfFamily: "Rajan Chacko", houseName: "Chacko Bhavan", phone: "9847078901", address: "Kottayam, Kerala", createdAt: "2020-05-18" },
  { id: "f8", familyNo: 107, headOfFamily: "Daniel Simon", houseName: "Simon Villa", phone: "9847089012", address: "Kottayam, Kerala", createdAt: "2020-06-10" },
  { id: "f9", familyNo: 108, headOfFamily: "Peter James", houseName: "James House", phone: "9847090123", address: "Kottayam, Kerala", createdAt: "2020-07-02" },
  { id: "f10", familyNo: 109, headOfFamily: "Paul Alexander", houseName: "Alexander Nivas", phone: "9847001234", address: "Kottayam, Kerala", createdAt: "2020-07-25" },
  { id: "f11", familyNo: 110, headOfFamily: "Mathew Jacob", houseName: "Jacob Cottage", phone: "9847112345", address: "Ernakulam, Kerala", createdAt: "2020-08-15" },
  { id: "f12", familyNo: 111, headOfFamily: "Kurian Thomas", houseName: "Thomas Mana", phone: "9847123456", address: "Ernakulam, Kerala", createdAt: "2020-09-01" },
  { id: "f13", familyNo: 112, headOfFamily: "Varghese Jose", houseName: "Jose Bhavan", phone: "9847134567", address: "Ernakulam, Kerala", createdAt: "2020-09-20" },
  { id: "f14", familyNo: 113, headOfFamily: "John David", houseName: "David Villa", phone: "9847145678", address: "Ernakulam, Kerala", createdAt: "2020-10-10" },
  { id: "f15", familyNo: 114, headOfFamily: "Philip Mathew", houseName: "Mathew House", phone: "9847156789", address: "Ernakulam, Kerala", createdAt: "2020-11-05" },
  { id: "f16", familyNo: 115, headOfFamily: "Chacko Samuel", houseName: "Samuel Nivas", phone: "9847167890", address: "Thrissur, Kerala", createdAt: "2020-11-25" },
  { id: "f17", familyNo: 116, headOfFamily: "Simon Abraham", houseName: "Abraham Cottage", phone: "9847178901", address: "Thrissur, Kerala", createdAt: "2020-12-15" },
  { id: "f18", familyNo: 117, headOfFamily: "James Rajan", houseName: "Rajan Mana", phone: "9847189012", address: "Thrissur, Kerala", createdAt: "2021-01-08" },
  { id: "f19", familyNo: 118, headOfFamily: "Alexander Daniel", houseName: "Daniel Bhavan", phone: "9847190123", address: "Thrissur, Kerala", createdAt: "2021-02-14" },
  { id: "f20", familyNo: 119, headOfFamily: "Jacob Peter", houseName: "Peter Villa", phone: "9847201234", address: "Thrissur, Kerala", createdAt: "2021-03-01" },
  { id: "f21", familyNo: 120, headOfFamily: "Jose Paul", houseName: "Paul House", phone: "9847212345", address: "Alappuzha, Kerala", createdAt: "2021-03-20" },
  { id: "f22", familyNo: 121, headOfFamily: "David George", houseName: "George Nivas", phone: "9847223456", address: "Alappuzha, Kerala", createdAt: "2021-04-10" },
  { id: "f23", familyNo: 122, headOfFamily: "Sajan Kurian", houseName: "Kurian Cottage", phone: "9847234567", address: "Alappuzha, Kerala", createdAt: "2021-05-05" },
  { id: "f24", familyNo: 123, headOfFamily: "Martin Varghese", houseName: "Varghese Mana", phone: "9847245678", address: "Alappuzha, Kerala", createdAt: "2021-06-18" },
  { id: "f25", familyNo: 124, headOfFamily: "Benny Thomas", houseName: "Thomas Bhavan", phone: "9847256789", address: "Idukki, Kerala", createdAt: "2021-07-12" },
  { id: "f26", familyNo: 125, headOfFamily: "Sunny Joseph", houseName: "Joseph Villa", phone: "9847267890", address: "Idukki, Kerala", createdAt: "2021-08-01" },
  { id: "f27", familyNo: 126, headOfFamily: "Joy Mathew", houseName: "Mathew Nivas", phone: "9847278901", address: "Idukki, Kerala", createdAt: "2021-09-15" },
  { id: "f28", familyNo: 127, headOfFamily: "Anil Samuel", houseName: "Samuel House", phone: "9847289012", address: "Pathanamthitta, Kerala", createdAt: "2021-10-08" },
  { id: "f29", familyNo: 128, headOfFamily: "Babu Chacko", houseName: "Chacko Cottage", phone: "9847290123", address: "Pathanamthitta, Kerala", createdAt: "2021-11-20" },
  { id: "f30", familyNo: 129, headOfFamily: "Vineeth Simon", houseName: "Simon Mana", phone: "9847301234", address: "Pathanamthitta, Kerala", createdAt: "2021-12-05" },
]

const membersByFamily: Record<string, Omit<Member, "familyId" | "familyNo" | "houseName">[]> = {
  f1: [
    { id: "m1", memberId: "10001", name: "B Reji", phone: "9847012345", dob: "1965-03-15", gender: "male", role: "Head" },
    { id: "m2", memberId: "10002", name: "Salamma Reji", phone: "9847012346", dob: "1968-07-22", gender: "female", role: "Spouse" },
    { id: "m3", memberId: "10003", name: "Rijin V Reji", phone: "9847012347", dob: "1995-11-10", gender: "male", role: "Son" },
    { id: "m4", memberId: "10004", name: "Alin Reji", phone: "9847012348", dob: "1998-04-05", gender: "male", role: "Son" },
    { id: "m5", memberId: "10005", name: "Ajin Reji", phone: "9847012349", dob: "2001-09-18", gender: "male", role: "Son" },
  ],
  f2: [
    { id: "m6", memberId: "10101", name: "Thomas Mathew", phone: "9847023456", dob: "1960-01-20", gender: "male", role: "Head" },
    { id: "m7", memberId: "10102", name: "Mary Thomas", phone: "9847023457", dob: "1963-05-14", gender: "female", role: "Spouse" },
    { id: "m8", memberId: "10103", name: "Anu Thomas", phone: "9847023458", dob: "1990-08-30", gender: "female", role: "Daughter" },
    { id: "m9", memberId: "10104", name: "Binu Thomas", phone: "9847023459", dob: "1993-12-25", gender: "male", role: "Son" },
  ],
  f3: [
    { id: "m10", memberId: "10201", name: "Joseph Kurian", phone: "9847034567", dob: "1958-06-10", gender: "male", role: "Head" },
    { id: "m11", memberId: "10202", name: "Elsa Joseph", phone: "9847034568", dob: "1962-09-08", gender: "female", role: "Spouse" },
    { id: "m12", memberId: "10203", name: "Deepu Joseph", phone: "9847034569", dob: "1988-02-14", gender: "male", role: "Son" },
    { id: "m13", memberId: "10204", name: "Neethu Joseph", phone: "9847034570", dob: "1991-11-22", gender: "female", role: "Daughter" },
    { id: "m14", memberId: "10205", name: "Rinu Joseph", phone: "9847034571", dob: "1996-07-04", gender: "female", role: "Daughter" },
  ],
  f4: [
    { id: "m15", memberId: "10301", name: "George Varghese", phone: "9847045678", dob: "1962-04-18", gender: "male", role: "Head" },
    { id: "m16", memberId: "10302", name: "Annamma George", phone: "9847045679", dob: "1965-08-25", gender: "female", role: "Spouse" },
    { id: "m17", memberId: "10303", name: "Sinu George", phone: "9847045680", dob: "1992-01-12", gender: "male", role: "Son" },
  ],
  f5: [
    { id: "m18", memberId: "10401", name: "Samuel John", phone: "9847056789", dob: "1970-10-05", gender: "male", role: "Head" },
    { id: "m19", memberId: "10402", name: "Litha Samuel", phone: "9847056790", dob: "1973-02-28", gender: "female", role: "Spouse" },
    { id: "m20", memberId: "10403", name: "Akhil Samuel", phone: "9847056791", dob: "1999-06-15", gender: "male", role: "Son" },
    { id: "m21", memberId: "10404", name: "Athira Samuel", phone: "9847056792", dob: "2002-03-20", gender: "female", role: "Daughter" },
  ],
  f6: [
    { id: "m22", memberId: "10501", name: "Abraham Philip", phone: "9847067890", dob: "1955-12-01", gender: "male", role: "Head" },
    { id: "m23", memberId: "10502", name: "Sosamma Abraham", phone: "9847067891", dob: "1958-04-16", gender: "female", role: "Spouse" },
    { id: "m24", memberId: "10503", name: "Jinu Abraham", phone: "9847067892", dob: "1985-09-22", gender: "male", role: "Son" },
    { id: "m25", memberId: "10504", name: "Jimy Abraham", phone: "9847067893", dob: "1988-01-30", gender: "male", role: "Son" },
  ],
  f7: [
    { id: "m26", memberId: "10601", name: "Rajan Chacko", phone: "9847078901", dob: "1963-07-14", gender: "male", role: "Head" },
    { id: "m27", memberId: "10602", name: "Lovely Rajan", phone: "9847078902", dob: "1966-11-20", gender: "female", role: "Spouse" },
    { id: "m28", memberId: "10603", name: "Arun Rajan", phone: "9847078903", dob: "1994-05-08", gender: "male", role: "Son" },
  ],
  f8: [
    { id: "m29", memberId: "10701", name: "Daniel Simon", phone: "9847089012", dob: "1968-02-22", gender: "male", role: "Head" },
    { id: "m30", memberId: "10702", name: "Shiny Daniel", phone: "9847089013", dob: "1971-06-18", gender: "female", role: "Spouse" },
    { id: "m31", memberId: "10703", name: "Kevin Daniel", phone: "9847089014", dob: "1997-10-30", gender: "male", role: "Son" },
    { id: "m32", memberId: "10704", name: "Karen Daniel", phone: "9847089015", dob: "2000-04-12", gender: "female", role: "Daughter" },
  ],
  f9: [
    { id: "m33", memberId: "10801", name: "Peter James", phone: "9847090123", dob: "1959-08-05", gender: "male", role: "Head" },
    { id: "m34", memberId: "10802", name: "Mercy Peter", phone: "9847090124", dob: "1962-12-10", gender: "female", role: "Spouse" },
    { id: "m35", memberId: "10803", name: "Alan Peter", phone: "9847090125", dob: "1990-03-25", gender: "male", role: "Son" },
  ],
  f10: [
    { id: "m36", memberId: "10901", name: "Paul Alexander", phone: "9847001234", dob: "1964-05-30", gender: "male", role: "Head" },
    { id: "m37", memberId: "10902", name: "Susan Paul", phone: "9847001235", dob: "1967-09-14", gender: "female", role: "Spouse" },
    { id: "m38", memberId: "10903", name: "Robin Paul", phone: "9847001236", dob: "1995-01-18", gender: "male", role: "Son" },
    { id: "m39", memberId: "10904", name: "Rachel Paul", phone: "9847001237", dob: "1997-07-22", gender: "female", role: "Daughter" },
  ],
  f11: [
    { id: "m40", memberId: "11001", name: "Mathew Jacob", phone: "9847112345", dob: "1966-11-12", gender: "male", role: "Head" },
    { id: "m41", memberId: "11002", name: "Beena Mathew", phone: "9847112346", dob: "1969-03-08", gender: "female", role: "Spouse" },
    { id: "m42", memberId: "11003", name: "Sajan Mathew", phone: "9847112347", dob: "1996-08-20", gender: "male", role: "Son" },
  ],
  f12: [
    { id: "m43", memberId: "11101", name: "Kurian Thomas", phone: "9847123456", dob: "1961-09-25", gender: "male", role: "Head" },
    { id: "m44", memberId: "11102", name: "Leela Kurian", phone: "9847123457", dob: "1964-01-14", gender: "female", role: "Spouse" },
    { id: "m45", memberId: "11103", name: "Manu Kurian", phone: "9847123458", dob: "1992-06-30", gender: "male", role: "Son" },
    { id: "m46", memberId: "11104", name: "Meera Kurian", phone: "9847123459", dob: "1994-12-05", gender: "female", role: "Daughter" },
  ],
  f13: [
    { id: "m47", memberId: "11201", name: "Varghese Jose", phone: "9847134567", dob: "1957-03-18", gender: "male", role: "Head" },
    { id: "m48", memberId: "11202", name: "Kunjamma Varghese", phone: "9847134568", dob: "1960-07-22", gender: "female", role: "Spouse" },
    { id: "m49", memberId: "11203", name: "Tony Varghese", phone: "9847134569", dob: "1987-11-10", gender: "male", role: "Son" },
  ],
  f14: [
    { id: "m50", memberId: "11301", name: "John David", phone: "9847145678", dob: "1969-08-14", gender: "male", role: "Head" },
    { id: "m51", memberId: "11302", name: "Reena John", phone: "9847145679", dob: "1972-12-20", gender: "female", role: "Spouse" },
    { id: "m52", memberId: "11303", name: "Joel John", phone: "9847145680", dob: "1999-04-08", gender: "male", role: "Son" },
    { id: "m53", memberId: "11304", name: "Jisha John", phone: "9847145681", dob: "2001-10-15", gender: "female", role: "Daughter" },
  ],
  f15: [
    { id: "m54", memberId: "11401", name: "Philip Mathew", phone: "9847156789", dob: "1963-02-28", gender: "male", role: "Head" },
    { id: "m55", memberId: "11402", name: "Mini Philip", phone: "9847156790", dob: "1966-06-14", gender: "female", role: "Spouse" },
    { id: "m56", memberId: "11403", name: "Bibin Philip", phone: "9847156791", dob: "1993-09-18", gender: "male", role: "Son" },
  ],
  f16: [
    { id: "m57", memberId: "11501", name: "Chacko Samuel", phone: "9847167890", dob: "1960-10-05", gender: "male", role: "Head" },
    { id: "m58", memberId: "11502", name: "Ammini Chacko", phone: "9847167891", dob: "1963-02-18", gender: "female", role: "Spouse" },
    { id: "m59", memberId: "11503", name: "Dinu Chacko", phone: "9847167892", dob: "1991-07-25", gender: "male", role: "Son" },
    { id: "m60", memberId: "11504", name: "Divya Chacko", phone: "9847167893", dob: "1994-11-08", gender: "female", role: "Daughter" },
  ],
  f17: [
    { id: "m61", memberId: "11601", name: "Simon Abraham", phone: "9847178901", dob: "1965-05-20", gender: "male", role: "Head" },
    { id: "m62", memberId: "11602", name: "Gracy Simon", phone: "9847178902", dob: "1968-09-12", gender: "female", role: "Spouse" },
    { id: "m63", memberId: "11603", name: "Sonu Simon", phone: "9847178903", dob: "1995-02-14", gender: "male", role: "Son" },
  ],
  f18: [
    { id: "m64", memberId: "11701", name: "James Rajan", phone: "9847189012", dob: "1967-04-10", gender: "male", role: "Head" },
    { id: "m65", memberId: "11702", name: "Thankamma James", phone: "9847189013", dob: "1970-08-25", gender: "female", role: "Spouse" },
    { id: "m66", memberId: "11703", name: "Vishnu James", phone: "9847189014", dob: "1998-01-18", gender: "male", role: "Son" },
  ],
  f19: [
    { id: "m67", memberId: "11801", name: "Alexander Daniel", phone: "9847190123", dob: "1962-12-08", gender: "male", role: "Head" },
    { id: "m68", memberId: "11802", name: "Mariamma Alexander", phone: "9847190124", dob: "1965-04-22", gender: "female", role: "Spouse" },
    { id: "m69", memberId: "11803", name: "Aju Alexander", phone: "9847190125", dob: "1993-08-30", gender: "male", role: "Son" },
    { id: "m70", memberId: "11804", name: "Anu Alexander", phone: "9847190126", dob: "1996-03-14", gender: "female", role: "Daughter" },
  ],
  f20: [
    { id: "m71", memberId: "11901", name: "Jacob Peter", phone: "9847201234", dob: "1964-07-18", gender: "male", role: "Head" },
    { id: "m72", memberId: "11902", name: "Alice Jacob", phone: "9847201235", dob: "1967-11-05", gender: "female", role: "Spouse" },
    { id: "m73", memberId: "11903", name: "Jobin Jacob", phone: "9847201236", dob: "1994-04-22", gender: "male", role: "Son" },
  ],
  f21: [
    { id: "m74", memberId: "12001", name: "Jose Paul", phone: "9847212345", dob: "1959-01-14", gender: "male", role: "Head" },
    { id: "m75", memberId: "12002", name: "Rosa Jose", phone: "9847212346", dob: "1962-05-30", gender: "female", role: "Spouse" },
    { id: "m76", memberId: "12003", name: "Febin Jose", phone: "9847212347", dob: "1989-10-08", gender: "male", role: "Son" },
    { id: "m77", memberId: "12004", name: "Femi Jose", phone: "9847212348", dob: "1992-06-22", gender: "female", role: "Daughter" },
  ],
  f22: [
    { id: "m78", memberId: "12101", name: "David George", phone: "9847223456", dob: "1966-03-25", gender: "male", role: "Head" },
    { id: "m79", memberId: "12102", name: "Jolly David", phone: "9847223457", dob: "1969-07-18", gender: "female", role: "Spouse" },
    { id: "m80", memberId: "12103", name: "Abin David", phone: "9847223458", dob: "1996-11-30", gender: "male", role: "Son" },
  ],
  f23: [
    { id: "m81", memberId: "12201", name: "Sajan Kurian", phone: "9847234567", dob: "1971-08-12", gender: "male", role: "Head" },
    { id: "m82", memberId: "12202", name: "Priya Sajan", phone: "9847234568", dob: "1974-12-28", gender: "female", role: "Spouse" },
    { id: "m83", memberId: "12203", name: "Adithya Sajan", phone: "9847234569", dob: "2000-05-14", gender: "male", role: "Son" },
    { id: "m84", memberId: "12204", name: "Amala Sajan", phone: "9847234570", dob: "2003-09-20", gender: "female", role: "Daughter" },
  ],
  f24: [
    { id: "m85", memberId: "12301", name: "Martin Varghese", phone: "9847245678", dob: "1968-06-05", gender: "male", role: "Head" },
    { id: "m86", memberId: "12302", name: "Lissy Martin", phone: "9847245679", dob: "1971-10-18", gender: "female", role: "Spouse" },
    { id: "m87", memberId: "12303", name: "Noel Martin", phone: "9847245680", dob: "1997-02-28", gender: "male", role: "Son" },
  ],
  f25: [
    { id: "m88", memberId: "12401", name: "Benny Thomas", phone: "9847256789", dob: "1961-11-22", gender: "male", role: "Head" },
    { id: "m89", memberId: "12402", name: "Molly Benny", phone: "9847256790", dob: "1964-03-08", gender: "female", role: "Spouse" },
    { id: "m90", memberId: "12403", name: "Blesson Benny", phone: "9847256791", dob: "1990-07-14", gender: "male", role: "Son" },
    { id: "m91", memberId: "12404", name: "Blessy Benny", phone: "9847256792", dob: "1993-01-25", gender: "female", role: "Daughter" },
  ],
  f26: [
    { id: "m92", memberId: "12501", name: "Sunny Joseph", phone: "9847267890", dob: "1970-04-14", gender: "male", role: "Head" },
    { id: "m93", memberId: "12502", name: "Jiji Sunny", phone: "9847267891", dob: "1973-08-30", gender: "female", role: "Spouse" },
    { id: "m94", memberId: "12503", name: "Sona Sunny", phone: "9847267892", dob: "2001-12-10", gender: "female", role: "Daughter" },
  ],
  f27: [
    { id: "m95", memberId: "12601", name: "Joy Mathew", phone: "9847278901", dob: "1963-09-18", gender: "male", role: "Head" },
    { id: "m96", memberId: "12602", name: "Tessy Joy", phone: "9847278902", dob: "1966-01-25", gender: "female", role: "Spouse" },
    { id: "m97", memberId: "12603", name: "Jithin Joy", phone: "9847278903", dob: "1993-05-30", gender: "male", role: "Son" },
    { id: "m98", memberId: "12604", name: "Jisha Joy", phone: "9847278904", dob: "1996-10-12", gender: "female", role: "Daughter" },
  ],
  f28: [
    { id: "m99", memberId: "12701", name: "Anil Samuel", phone: "9847289012", dob: "1965-02-08", gender: "male", role: "Head" },
    { id: "m100", memberId: "12702", name: "Saly Anil", phone: "9847289013", dob: "1968-06-22", gender: "female", role: "Spouse" },
    { id: "m101", memberId: "12703", name: "Alen Anil", phone: "9847289014", dob: "1995-11-14", gender: "male", role: "Son" },
  ],
  f29: [
    { id: "m102", memberId: "12801", name: "Babu Chacko", phone: "9847290123", dob: "1967-07-30", gender: "male", role: "Head" },
    { id: "m103", memberId: "12802", name: "Shibi Babu", phone: "9847290124", dob: "1970-11-18", gender: "female", role: "Spouse" },
    { id: "m104", memberId: "12803", name: "Bichu Babu", phone: "9847290125", dob: "1998-03-22", gender: "male", role: "Son" },
    { id: "m105", memberId: "12804", name: "Bincy Babu", phone: "9847290126", dob: "2000-08-05", gender: "female", role: "Daughter" },
  ],
  f30: [
    { id: "m106", memberId: "12901", name: "Vineeth Simon", phone: "9847301234", dob: "1972-10-20", gender: "male", role: "Head" },
    { id: "m107", memberId: "12902", name: "Nimmy Vineeth", phone: "9847301235", dob: "1975-02-14", gender: "female", role: "Spouse" },
    { id: "m108", memberId: "12903", name: "Vivek Vineeth", phone: "9847301236", dob: "2002-06-28", gender: "male", role: "Son" },
  ],
}

// Build complete families with members
export const families: Family[] = familyData.map((fam) => ({
  ...fam,
  members: (membersByFamily[fam.id] || []).map((m) => ({
    ...m,
    familyId: fam.id,
    familyNo: fam.familyNo,
    houseName: fam.houseName,
  })),
}))

// Flatten all members
export const members: Member[] = families.flatMap((f) => f.members)

// ============================================
// TRANSACTIONS
// ============================================

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return d.toISOString().split("T")[0]
}

function generateTransactions(): Transaction[] {
  const transactions: Transaction[] = []
  const categories: CategoryType[] = ["birthday", "wedding", "monthly", "new-project", "donation", "thanksgiving", "special-offering", "others"]
  const paymentMethods: PaymentMethodType[] = ["cash", "upi", "bank-transfer", "cheque"]
  const collectors = ["Fr. Thomas", "Fr. Joseph", "Deacon Samuel", "Admin"]
  const now = new Date()
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
  
  let receiptCounter = 1000

  // Generate monthly contributions for most families
  for (let month = 0; month < 12; month++) {
    const monthDate = new Date(now.getFullYear(), now.getMonth() - 11 + month, 1)
    const familiesForMonth = families.slice(0, 20 + Math.floor(Math.random() * 10))
    
    for (const family of familiesForMonth) {
      const head = family.members[0]
      if (!head) continue
      receiptCounter++
      transactions.push({
        id: `t-monthly-${month}-${family.id}`,
        date: randomDate(
          new Date(monthDate.getFullYear(), monthDate.getMonth(), 1),
          new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0)
        ),
        receiptNo: `REC-${receiptCounter}`,
        category: "monthly",
        familyId: family.id,
        familyNo: family.familyNo,
        houseName: family.houseName,
        memberId: head.id,
        memberName: head.name,
        description: "Monthly Contribution (Masavari)",
        amount: [100, 150, 200, 250, 300, 500][Math.floor(Math.random() * 6)],
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        collectedBy: collectors[Math.floor(Math.random() * collectors.length)],
        type: "income",
      })
    }
  }

  // Generate birthday contributions
  for (let i = 0; i < 25; i++) {
    const member = members[Math.floor(Math.random() * members.length)]
    const family = families.find((f) => f.id === member.familyId)!
    receiptCounter++
    transactions.push({
      id: `t-bday-${i}`,
      date: randomDate(oneYearAgo, now),
      receiptNo: `REC-${receiptCounter}`,
      category: "birthday",
      familyId: family.id,
      familyNo: family.familyNo,
      houseName: family.houseName,
      memberId: member.id,
      memberName: member.name,
      description: `Birthday offering - ${member.name}`,
      amount: [200, 300, 500, 1000, 1500][Math.floor(Math.random() * 5)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      collectedBy: collectors[Math.floor(Math.random() * collectors.length)],
      type: "income",
    })
  }

  // Generate wedding anniversary contributions
  for (let i = 0; i < 15; i++) {
    const family = families[Math.floor(Math.random() * families.length)]
    const head = family.members[0]
    if (!head) continue
    receiptCounter++
    transactions.push({
      id: `t-wedding-${i}`,
      date: randomDate(oneYearAgo, now),
      receiptNo: `REC-${receiptCounter}`,
      category: "wedding",
      familyId: family.id,
      familyNo: family.familyNo,
      houseName: family.houseName,
      memberId: head.id,
      memberName: head.name,
      description: `Wedding Anniversary offering`,
      amount: [500, 1000, 1500, 2000][Math.floor(Math.random() * 4)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      collectedBy: collectors[Math.floor(Math.random() * collectors.length)],
      type: "income",
    })
  }

  // Generate new project contributions
  for (let i = 0; i < 20; i++) {
    const family = families[Math.floor(Math.random() * families.length)]
    const head = family.members[0]
    if (!head) continue
    receiptCounter++
    transactions.push({
      id: `t-project-${i}`,
      date: randomDate(oneYearAgo, now),
      receiptNo: `REC-${receiptCounter}`,
      category: "new-project",
      familyId: family.id,
      familyNo: family.familyNo,
      houseName: family.houseName,
      memberId: head.id,
      memberName: head.name,
      description: "New Church Building Fund",
      amount: [1000, 2000, 5000, 10000, 25000][Math.floor(Math.random() * 5)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      collectedBy: collectors[Math.floor(Math.random() * collectors.length)],
      type: "income",
    })
  }

  // Generate donations
  for (let i = 0; i < 18; i++) {
    const member = members[Math.floor(Math.random() * members.length)]
    const family = families.find((f) => f.id === member.familyId)!
    receiptCounter++
    transactions.push({
      id: `t-donation-${i}`,
      date: randomDate(oneYearAgo, now),
      receiptNo: `REC-${receiptCounter}`,
      category: "donation",
      familyId: family.id,
      familyNo: family.familyNo,
      houseName: family.houseName,
      memberId: member.id,
      memberName: member.name,
      description: "General Donation",
      amount: [500, 1000, 2000, 5000][Math.floor(Math.random() * 4)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      collectedBy: collectors[Math.floor(Math.random() * collectors.length)],
      type: "income",
    })
  }

  // Generate thanksgiving
  for (let i = 0; i < 10; i++) {
    const member = members[Math.floor(Math.random() * members.length)]
    const family = families.find((f) => f.id === member.familyId)!
    receiptCounter++
    transactions.push({
      id: `t-thanks-${i}`,
      date: randomDate(oneYearAgo, now),
      receiptNo: `REC-${receiptCounter}`,
      category: "thanksgiving",
      familyId: family.id,
      familyNo: family.familyNo,
      houseName: family.houseName,
      memberId: member.id,
      memberName: member.name,
      description: "Thanksgiving Offering",
      amount: [1000, 2000, 3000, 5000][Math.floor(Math.random() * 4)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      collectedBy: collectors[Math.floor(Math.random() * collectors.length)],
      type: "income",
    })
  }

  // Generate special offerings
  for (let i = 0; i < 8; i++) {
    const member = members[Math.floor(Math.random() * members.length)]
    const family = families.find((f) => f.id === member.familyId)!
    receiptCounter++
    transactions.push({
      id: `t-special-${i}`,
      date: randomDate(oneYearAgo, now),
      receiptNo: `REC-${receiptCounter}`,
      category: "special-offering",
      familyId: family.id,
      familyNo: family.familyNo,
      houseName: family.houseName,
      memberId: member.id,
      memberName: member.name,
      description: "Special Offering",
      amount: [500, 1000, 2500, 5000][Math.floor(Math.random() * 4)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      collectedBy: collectors[Math.floor(Math.random() * collectors.length)],
      type: "income",
    })
  }

  // Generate expenses
  const expenseDescriptions = [
    "Electricity Bill", "Water Bill", "Priest Salary", "Staff Salary",
    "Maintenance", "Flower Decoration", "Sound System", "Printing",
    "Stationery", "Festival Expenses", "Charity Distribution", "Transport"
  ]
  for (let i = 0; i < 30; i++) {
    receiptCounter++
    transactions.push({
      id: `t-expense-${i}`,
      date: randomDate(oneYearAgo, now),
      receiptNo: `EXP-${receiptCounter}`,
      category: "others",
      familyId: "",
      familyNo: 0,
      houseName: "",
      memberName: "Church Admin",
      description: expenseDescriptions[Math.floor(Math.random() * expenseDescriptions.length)],
      amount: [500, 1000, 2000, 3000, 5000, 8000, 10000, 15000][Math.floor(Math.random() * 8)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      collectedBy: "Admin",
      type: "expense",
    })
  }

  // Add some today's transactions
  const today = now.toISOString().split("T")[0]
  const todayFamilies = families.slice(0, 5)
  for (const family of todayFamilies) {
    const head = family.members[0]
    if (!head) continue
    receiptCounter++
    const cat = categories[Math.floor(Math.random() * 5)]
    transactions.push({
      id: `t-today-${family.id}`,
      date: today,
      receiptNo: `REC-${receiptCounter}`,
      category: cat,
      familyId: family.id,
      familyNo: family.familyNo,
      houseName: family.houseName,
      memberId: head.id,
      memberName: head.name,
      description: `${cat.charAt(0).toUpperCase() + cat.slice(1)} contribution`,
      amount: [500, 1000, 2000][Math.floor(Math.random() * 3)],
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      collectedBy: collectors[Math.floor(Math.random() * collectors.length)],
      type: "income",
    })
  }

  // Sort by date descending
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export const transactions = generateTransactions()

// ============================================
// COMPUTED STATISTICS
// ============================================

const now = new Date()
const today = now.toISOString().split("T")[0]
const thisMonth = now.getMonth()
const thisYear = now.getFullYear()

export function getStats() {
  const income = transactions.filter((t) => t.type === "income")
  const expenses = transactions.filter((t) => t.type === "expense")

  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0)

  const todayIncome = income.filter((t) => t.date === today).reduce((sum, t) => sum + t.amount, 0)
  const todayExpense = expenses.filter((t) => t.date === today).reduce((sum, t) => sum + t.amount, 0)

  const monthIncome = income
    .filter((t) => { const d = new Date(t.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear })
    .reduce((sum, t) => sum + t.amount, 0)
  const monthExpense = expenses
    .filter((t) => { const d = new Date(t.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear })
    .reduce((sum, t) => sum + t.amount, 0)

  const yearIncome = income
    .filter((t) => new Date(t.date).getFullYear() === thisYear)
    .reduce((sum, t) => sum + t.amount, 0)

  const birthdayFund = income.filter((t) => t.category === "birthday").reduce((sum, t) => sum + t.amount, 0)
  const weddingFund = income.filter((t) => t.category === "wedding").reduce((sum, t) => sum + t.amount, 0)
  const monthlyFund = income.filter((t) => t.category === "monthly").reduce((sum, t) => sum + t.amount, 0)
  const projectFund = income.filter((t) => t.category === "new-project").reduce((sum, t) => sum + t.amount, 0)
  const donationFund = income.filter((t) => t.category === "donation").reduce((sum, t) => sum + t.amount, 0)

  return {
    totalFamilies: families.length,
    totalMembers: members.length,
    birthdayFund,
    weddingFund,
    monthlyFund,
    projectFund,
    donationFund,
    totalIncome,
    totalExpenses,
    currentBalance: totalIncome - totalExpenses,
    todayIncome,
    todayExpense,
    monthIncome,
    monthExpense,
    yearIncome,
  }
}

export function getCategoryTotals() {
  const income = transactions.filter((t) => t.type === "income")
  return [
    { name: "Birthday", value: income.filter((t) => t.category === "birthday").reduce((s, t) => s + t.amount, 0), color: "#ec4899" },
    { name: "Wedding", value: income.filter((t) => t.category === "wedding").reduce((s, t) => s + t.amount, 0), color: "#f43f5e" },
    { name: "Monthly", value: income.filter((t) => t.category === "monthly").reduce((s, t) => s + t.amount, 0), color: "#22c55e" },
    { name: "New Project", value: income.filter((t) => t.category === "new-project").reduce((s, t) => s + t.amount, 0), color: "#f59e0b" },
    { name: "Donations", value: income.filter((t) => t.category === "donation").reduce((s, t) => s + t.amount, 0), color: "#8b5cf6" },
    { name: "Thanksgiving", value: income.filter((t) => t.category === "thanksgiving").reduce((s, t) => s + t.amount, 0), color: "#06b6d4" },
    { name: "Special Offering", value: income.filter((t) => t.category === "special-offering").reduce((s, t) => s + t.amount, 0), color: "#6366f1" },
    { name: "Others", value: income.filter((t) => t.category === "others").reduce((s, t) => s + t.amount, 0), color: "#64748b" },
  ]
}

export function getMonthlyIncome() {
  const months = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(thisYear, thisMonth - i, 1)
    const monthName = d.toLocaleDateString("en-IN", { month: "short" })
    const year = d.getFullYear()
    const month = d.getMonth()
    const income = transactions
      .filter((t) => t.type === "income" && new Date(t.date).getMonth() === month && new Date(t.date).getFullYear() === year)
      .reduce((s, t) => s + t.amount, 0)
    const expense = transactions
      .filter((t) => t.type === "expense" && new Date(t.date).getMonth() === month && new Date(t.date).getFullYear() === year)
      .reduce((s, t) => s + t.amount, 0)
    months.push({ month: `${monthName} ${year.toString().slice(-2)}`, income, expense })
  }
  return months
}

export function getUpcomingBirthdays() {
  return members
    .map((m) => {
      const dob = new Date(m.dob)
      const today = new Date()
      const nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate())
      if (nextBday < today) nextBday.setFullYear(nextBday.getFullYear() + 1)
      const daysUntil = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      return { ...m, daysUntil, nextBirthday: nextBday.toISOString().split("T")[0] }
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 8)
}

export function getPendingMonthlyContributions() {
  const paidFamilyIds = new Set(
    transactions
      .filter((t) => {
        const d = new Date(t.date)
        return t.category === "monthly" && d.getMonth() === thisMonth && d.getFullYear() === thisYear
      })
      .map((t) => t.familyId)
  )
  return families.filter((f) => !paidFamilyIds.has(f.id)).slice(0, 10)
}

export function getTopContributors() {
  const familyTotals: Record<string, { name: string; houseName: string; total: number }> = {}
  transactions
    .filter((t) => t.type === "income" && t.familyId)
    .forEach((t) => {
      if (!familyTotals[t.familyId]) {
        familyTotals[t.familyId] = { name: t.houseName, houseName: t.houseName, total: 0 }
      }
      familyTotals[t.familyId].total += t.amount
    })
  return Object.entries(familyTotals)
    .map(([id, data]) => ({ familyId: id, ...data }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
}
