// =======================================================================
// 7DBIO PLATFORM v2.0 - DATABASE & REPOSITORY MANAGEMENT (LocalStorage)
// =======================================================================

const SCHEMA_VERSION = "2.4";

// --- TAXONOMIES: BRANDS & INDICATIONS ---
const defaultBrands = [
  { id: "allergan", name: "Allergan AbbVie", country: "Hoa Kỳ / Pháp" },
  { id: "galderma", name: "Galderma", country: "Thụy Sĩ" },
  { id: "medytox", name: "Medytox", country: "Hàn Quốc" },
  { id: "hugel", name: "Hugel Inc", country: "Hàn Quốc" }
];

const defaultIndications = [
  { id: "lips", name: "Tạo hình môi Baby / Cherry", icon: "fa-lips" },
  { id: "nose_chin", name: "Nâng mũi & Cằm V-line", icon: "fa-circle-chevron-up" },
  { id: "nasolabial", name: "Xóa rãnh cười & Má hóp", icon: "fa-smile" },
  { id: "forehead", name: "Xóa nhăn trán & Cau mày", icon: "fa-face-rolling-eyes" },
  { id: "jaw", name: "Thon gọn góc hàm / Cơ cắn", icon: "fa-compress" },
  { id: "skin", name: "Căng bóng & Trẻ hóa vi điểm", icon: "fa-wand-magic-sparkles" }
];

// --- MEDICAL AESTHETIC PRODUCTS WITH TECHNICAL SPECS & COLD-CHAIN SPECS ---
const defaultProducts = [
  {
    id: "prod-1",
    sku: "JUV-U4-001",
    name: "Juvederm Ultra 4 (2x1ml)",
    category: "filler",
    brandId: "allergan",
    indicationIds: ["nose_chin", "nasolabial"],
    price: 4500000,
    wholesalePrice: 3800000,
    stock: 16,
    image: "images/filler_2.png",
    images: ["images/filler_2.png", "images/filler_hero.png"],
    medicalSpecs: {
      activeIngredient: "Hyaluronic Acid 24mg/ml + 0.3% Lidocaine",
      origin: "Pháp (Allergan AbbVie)",
      licenseNumber: "1800234/BYT-TB-CT",
      storageTemp: "2°C - 25°C (Tránh đông đá)",
      durationMonths: "12 - 18 tháng",
      needleGauge: "27G 1/2"
    },
    batchInfo: {
      batchNo: "VB2026A",
      mfgDate: "2026-01-10",
      expDate: "2028-01-09"
    },
    description: "Juvederm Ultra 4 là dòng filler cao cấp của hãng Allergan (Mỹ), chuyên dùng để làm đầy nếp nhăn sâu, nâng mũi, tạo hình môi và cằm. Mang lại hiệu quả tự nhiên kéo dài từ 12-18 tháng.",
    uses: "Định hình đường nét khuôn mặt, nâng cao sống mũi, làm đầy má hóp, tạo cằm V-line, trẻ hóa tức thì.",
    usage: "Tiêm dưới da hoặc lớp trung bì sâu bởi bác sĩ chuyên khoa có chứng chỉ hành nghề. Không tự ý tiêm tại nhà."
  },
  {
    id: "prod-2",
    sku: "RES-CL-002",
    name: "Restylane Classic 1ml",
    category: "filler",
    brandId: "galderma",
    indicationIds: ["lips", "nasolabial"],
    price: 3800000,
    wholesalePrice: 3200000,
    stock: 12,
    image: "images/filler_hero.png",
    images: ["images/filler_hero.png", "images/filler_2.png"],
    medicalSpecs: {
      activeIngredient: "Non-Animal Stabilized HA (NASHA) 20mg/ml",
      origin: "Thụy Sĩ (Galderma)",
      licenseNumber: "2100451/BYT-TB-CT",
      storageTemp: "2°C - 25°C (Bảo quản tránh ánh sáng)",
      durationMonths: "9 - 12 tháng",
      needleGauge: "29G 1/2"
    },
    batchInfo: {
      batchNo: "RS2026C",
      mfgDate: "2026-02-15",
      expDate: "2028-02-14"
    },
    description: "Restylane Classic chứa Axit Hyaluronic liên kết chéo công nghệ NASHA độc quyền từ Galderma. Thích hợp để làm mờ nếp nhăn vừa đến sâu và tạo form môi tinh tế.",
    uses: "Làm mờ nếp nhăn tĩnh vừa và nông, làm đầy rãnh cười, cấp ẩm làm căng bóng môi tự nhiên.",
    usage: "Sử dụng kỹ thuật tiêm vi điểm hoặc tiêm lớp trung bì. Chỉ thực hiện tại cơ sở y tế thẩm mỹ được cấp phép."
  },
  {
    id: "prod-3",
    sku: "BTX-ALL-100",
    name: "Botox Allergan 100 Units",
    category: "botox",
    brandId: "allergan",
    indicationIds: ["forehead", "jaw"],
    price: 5500000,
    wholesalePrice: 4600000,
    stock: 20,
    image: "images/botox_2.png",
    images: ["images/botox_2.png", "images/botox_hero.png"],
    medicalSpecs: {
      activeIngredient: "OnabotulinumtoxinA 100 Allergan Units",
      origin: "Hoa Kỳ / Ireland (Allergan)",
      licenseNumber: "1900112/BYT-QLD",
      storageTemp: "2°C - 8°C (Tiêu chuẩn Cold-Chain nghiêm ngặt)",
      durationMonths: "4 - 6 tháng",
      needleGauge: "30G - 32G siêu mảnh"
    },
    batchInfo: {
      batchNo: "AT2026-9",
      mfgDate: "2026-03-01",
      expDate: "2028-03-01"
    },
    description: "Botox Allergan là thương hiệu xóa nhăn hàng đầu thế giới được FDA Hoa Kỳ chứng nhận. Giúp thư giãn các cơ gây nếp nhăn ở trán, nếp cau mày và làm thon gọn cơ cắn góc hàm.",
    uses: "Xóa nếp nhăn động vùng trán, nếp nhăn giữa 2 chân mày, vết chân chim khóe mắt, thu nhỏ bắp cơ cắn làm thon gọn mặt V-line.",
    usage: "Pha với nước muối sinh lý vô khuẩn 0.9% Natri Clorid không chất bảo quản. Tiêm bắp vùng đích bởi Bác sĩ."
  },
  {
    id: "prod-4",
    sku: "DSP-500-004",
    name: "Dysport 500 Units",
    category: "botox",
    brandId: "galderma",
    indicationIds: ["forehead", "jaw"],
    price: 6200000,
    wholesalePrice: 5300000,
    stock: 9,
    image: "images/botox_hero.png",
    images: ["images/botox_hero.png", "images/botox_2.png"],
    medicalSpecs: {
      activeIngredient: "Clostridium Botulinum Type A Toxin-Haemagglutinin Complex 500 Speywood Units",
      origin: "Pháp / Anh (Ipsen Biopharm)",
      licenseNumber: "2000889/BYT-QLD",
      storageTemp: "2°C - 8°C (Cold-Chain chuyển lạnh có đá gel)",
      durationMonths: "5 - 6 tháng",
      needleGauge: "30G 1/2"
    },
    batchInfo: {
      batchNo: "DY2026F",
      mfgDate: "2026-01-20",
      expDate: "2027-11-20"
    },
    description: "Dysport là dòng xóa nhăn chuyên nghiệp của châu Âu, có độ khuếch tán cơ rộng, mang lại hiệu quả nhanh chóng và tự nhiên trong việc làm phẳng nếp nhăn trán và thon gọn hàm.",
    uses: "Điều trị nếp nhăn biểu cảm nửa mặt trên, nâng cung mày, trẻ hóa toàn diện cơ mặt và tạo viền hàm thon gọn.",
    usage: "Pha loãng với dung dịch NaCl 0.9% theo đúng tỷ lệ nhà sản xuất trước khi tiêm. Bảo quản trong vòng 24h sau khi pha ở 2-8°C."
  },
  {
    id: "prod-5",
    sku: "PF-HL-005",
    name: "Profhilo H+L (1x2ml)",
    category: "skinbooster",
    brandId: "galderma",
    indicationIds: ["skin", "nasolabial"],
    price: 6800000,
    wholesalePrice: 5800000,
    stock: 15,
    volume: "1 x 2.0ml",
    badge: "Haute Glow",
    image: "images/filler_hero.png",
    images: ["images/filler_hero.png", "images/about_bg.png"],
    medicalSpecs: {
      activeIngredient: "Hybrid Complexes HA 64mg/2ml (32mg H-HA + 32mg L-HA)",
      origin: "Ý (IBSA Farmaceutici)",
      licenseNumber: "2200389/BYT-TB-CT",
      storageTemp: "2°C - 25°C",
      durationMonths: "6 - 9 tháng",
      needleGauge: "29G Terumo"
    },
    batchInfo: {
      batchNo: "PF2026B",
      mfgDate: "2026-02-01",
      expDate: "2028-02-01"
    },
    description: "Profhilo là liệu pháp tái cấu trúc sinh học hàng đầu châu Âu giúp kích thích tăng sinh 4 loại collagen và elastin, phục hồi độ săn chắc và căng bóng tối đa cho làn da lão hóa.",
    uses: "Trẻ hóa đa tầng công nghệ BAP 5 điểm, cải thiện độ đàn hồi, làm đầy nếp nhăn li ti và cấp ẩm chuyên sâu.",
    usage: "Tiêm 5 điểm BAP sinh học mỗi bên mặt bởi Bác sĩ da liễu. Liệu trình 2 buổi cách nhau 4 tuần."
  },
  {
    id: "prod-6",
    sku: "RJ-HL-006",
    name: "Rejuran Healer (2x2ml)",
    category: "skinbooster",
    brandId: "hugel",
    indicationIds: ["skin"],
    price: 4200000,
    wholesalePrice: 3500000,
    stock: 18,
    volume: "2 x 2.0ml",
    badge: "Cellular DNA",
    image: "images/filler_2.png",
    images: ["images/filler_2.png", "images/hero_banner.png"],
    medicalSpecs: {
      activeIngredient: "Polynucleotide (PN) 2% chiết xuất DNA cá hồi hoang dã",
      origin: "Hàn Quốc (PharmaResearch)",
      licenseNumber: "2300109/BYT-TB-CT",
      storageTemp: "1°C - 30°C",
      durationMonths: "6 - 12 tháng",
      needleGauge: "33G - 34G Nano Needle"
    },
    batchInfo: {
      batchNo: "RJ2026H",
      mfgDate: "2026-01-15",
      expDate: "2028-01-14"
    },
    description: "Rejuran Healer tái sinh làn da từ cấp độ tế bào với chuỗi Polynucleotide (PN) tinh khiết. Thúc đẩy quá trình tự phục hồi vết thương, se khít lỗ chân lông và làm dày hàng rào biểu bì bảo vệ da.",
    uses: "Tái tạo ma trận ngoại bào, phục hồi da tổn thương sau laser, làm mờ sẹo mụn, giảm nếp nhăn quanh mắt và cải thiện tông da.",
    usage: "Tiêm vi điểm nốt sần toàn mặt bởi Bác sĩ hoặc chuyên viên y tế được cấp phép."
  },
  {
    id: "prod-7",
    sku: "BTX-BTX-100",
    name: "Botulax 100 Units",
    category: "botox",
    brandId: "hugel",
    indicationIds: ["forehead", "jaw"],
    price: 2200000,
    wholesalePrice: 1750000,
    stock: 25,
    volume: "100 Units",
    badge: "Bestseller Asia",
    image: "images/botox_2.png",
    images: ["images/botox_2.png", "images/botox_hero.png"],
    medicalSpecs: {
      activeIngredient: "Clostridium Botulinum Toxin Type A 100 Units",
      origin: "Hàn Quốc (Hugel Inc)",
      licenseNumber: "1700412/BYT-QLD",
      storageTemp: "2°C - 8°C (Cold-Chain bảo quản lạnh)",
      durationMonths: "4 - 6 tháng",
      needleGauge: "30G - 31G"
    },
    batchInfo: {
      batchNo: "BX2026K",
      mfgDate: "2026-02-10",
      expDate: "2028-02-09"
    },
    description: "Botulax 100U của tập đoàn Hugel là dòng botox Hàn Quốc bán chạy số 1 châu Á. Độ tinh khiết cao, hiệu quả ức chế co cơ nhanh và kiểm soát nếp nhăn vượt trội với chi phí hợp lý.",
    uses: "Xóa nếp nhăn trán, đuôi mắt, thon gọn góc hàm, hạ gò má và ức chế tuyến mồ hôi nách.",
    usage: "Pha loãng với 2.5ml nước muối sinh lý 0.9% NaCl trước khi tiêm. Bảo quản lạnh 2°C - 8°C."
  },
  {
    id: "prod-8",
    sku: "JUV-VOL-008",
    name: "Juvederm Voluma XC (2x1ml)",
    category: "filler",
    brandId: "allergan",
    indicationIds: ["nose_chin", "nasolabial"],
    price: 5800000,
    wholesalePrice: 4900000,
    stock: 14,
    volume: "2 x 1.0ml",
    badge: "Vycross Luxury",
    image: "images/filler_hero.png",
    images: ["images/filler_hero.png", "images/filler_2.png"],
    medicalSpecs: {
      activeIngredient: "Cross-linked HA 20mg/ml + 0.3% Lidocaine công nghệ Vycross",
      origin: "Pháp (Allergan AbbVie)",
      licenseNumber: "1800235/BYT-TB-CT",
      storageTemp: "2°C - 25°C",
      durationMonths: "18 - 24 tháng",
      needleGauge: "27G 1/2"
    },
    batchInfo: {
      batchNo: "JV2026X",
      mfgDate: "2026-03-05",
      expDate: "2028-03-04"
    },
    description: "Juvederm Voluma XC sử dụng công nghệ Vycross tiên tiến nhất của Allergan, tạo liên kết chéo bền vững chuyên sâu cho vùng giữa khuôn mặt, nâng đỡ cấu trúc mô tối ưu với thời gian duy trì lên tới 24 tháng.",
    uses: "Khôi phục thể tích vùng má hóp, định hình góc cằm chuẩn tỷ lệ vàng, tạo sống mũi cao thanh thoát.",
    usage: "Tiêm màng xương hoặc lớp dưới da sâu bởi Bác sĩ chuyên khoa thẩm mỹ."
  }
];

// --- AUTHENTIC SERIAL NUMBERS FOR ANTI-COUNTERFEIT CHECKER ---
const defaultSerials = [
  {
    serial: "7D-BTOX-994821",
    productName: "Botox Allergan 100 Units",
    batchNo: "AT2026-9",
    expDate: "2028-03-01",
    origin: "Hoa Kỳ (Allergan Inc)",
    license: "1900112/BYT-QLD",
    distributor: "7Dbio Vietnam Co., Ltd (Độc quyền chính ngạch)",
    status: "valid",
    checkCount: 1,
    verifiedDate: "2026-09-24"
  },
  {
    serial: "7D-FILL-883102",
    productName: "Juvederm Ultra 4 (2x1ml)",
    batchNo: "VB2026A",
    expDate: "2028-01-09",
    origin: "Pháp (Allergan AbbVie)",
    license: "1800234/BYT-TB-CT",
    distributor: "7Dbio Vietnam Co., Ltd (Độc quyền chính ngạch)",
    status: "valid",
    checkCount: 2,
    verifiedDate: "2026-09-23"
  },
  {
    serial: "7D-DYSP-771923",
    productName: "Dysport 500 Units",
    batchNo: "DY2026F",
    expDate: "2027-11-20",
    origin: "Pháp (Ipsen / Galderma)",
    license: "2000889/BYT-QLD",
    distributor: "7Dbio Vietnam Co., Ltd (Độc quyền chính ngạch)",
    status: "valid",
    checkCount: 0,
    verifiedDate: "Chưa kích hoạt lần nào"
  },
  {
    serial: "7D-REST-662814",
    productName: "Restylane Classic 1ml",
    batchNo: "RS2026C",
    expDate: "2028-02-14",
    origin: "Thụy Sĩ (Galderma)",
    license: "2100451/BYT-TB-CT",
    distributor: "7Dbio Vietnam Co., Ltd (Độc quyền chính ngạch)",
    status: "valid",
    checkCount: 1,
    verifiedDate: "2026-09-20"
  }
];

// --- PROMOTIONAL COUPONS / VOUCHERS ---
const defaultCoupons = [
  {
    code: "VIPDOCTOR",
    discountPercent: 10,
    maxDiscount: 2000000,
    minOrder: 5000000,
    description: "Chiết khấu 10% (Tối đa 2.000.000đ) cho đơn hàng Y khoa B2B"
  },
  {
    code: "7DBIO50K",
    discountAmount: 50000,
    minOrder: 1500000,
    description: "Giảm trực tiếp 50.000đ cho đơn hàng từ 1.500.000đ"
  },
  {
    code: "FREESHIP",
    freeShipping: true,
    minOrder: 0,
    description: "Miễn phí vận chuyển lạnh chuyên dụng toàn quốc"
  }
];

// --- ROLE DEFINITIONS & PERMISSIONS MATRIX (RBAC) ---
const ROLE_DEFINITIONS = {
  super_admin: {
    label: "Quản Trị Viên Tối Cao",
    badgeClass: "badge-super-admin",
    level: 5,
    department: "Ban Giám Đốc & Hội Đồng Y Khoa",
    permissions: ["*"]
  },
  warehouse_logistics: {
    label: "Quản Lý Kho & Chuỗi Lạnh GSP",
    badgeClass: "badge-warehouse",
    level: 4,
    department: "Kho Vận Chuỗi Lạnh 2-8°C & Dược Phẩm",
    permissions: [
      "view_orders",
      "update_coldchain_status",
      "manage_inventory_stock",
      "manage_batch_expiry",
      "manage_anti_counterfeit_serials",
      "view_products_specs"
    ]
  },
  sales_rep: {
    label: "Chuyên Viên B2B & Kinh Doanh",
    badgeClass: "badge-sales",
    level: 3,
    department: "Kinh Doanh & Phát Triển Đối Tác Clinic/Spa",
    permissions: [
      "view_b2b_applications",
      "review_b2b_applications",
      "view_orders",
      "create_order_on_behalf",
      "view_products_specs",
      "view_stock_levels"
    ]
  },
  b2b_clinic: {
    label: "Bác Sĩ & Viện Thẩm Mỹ (VIP B2B)",
    badgeClass: "badge-b2b",
    level: 2,
    department: "Đối tác Y tế",
    permissions: [
      "view_wholesale_prices",
      "bulk_order",
      "download_legal_specs",
      "track_coldchain_shipment"
    ]
  },
  customer: {
    label: "Khách Hàng / Thành Viên Privé",
    badgeClass: "badge-customer",
    level: 1,
    department: "Khách lẻ",
    permissions: [
      "view_retail_prices",
      "retail_order",
      "verify_serials",
      "wishlist"
    ]
  }
};

const hasPermission = (user, permissionKey) => {
  if (!user) return false;
  if (user.role === 'super_admin' || user.role === 'admin') return true;
  const roleDef = ROLE_DEFINITIONS[user.role];
  if (!roleDef) return false;
  if (roleDef.permissions.includes('*')) return true;
  return roleDef.permissions.includes(permissionKey);
};

const isInternalUser = (user) => {
  if (!user) return false;
  return ['super_admin', 'admin', 'warehouse_logistics', 'sales_rep'].includes(user.role);
};

// --- DEFAULT B2B PARTNER APPLICATIONS ---
const defaultB2BApplications = [
  {
    id: "B2B-APP-102",
    doctorName: "BS. Trần Thanh Tâm",
    clinicName: "Phòng Khám Da Liễu Dr. Tâm & Partners",
    medicalLicense: "CCHN-009214/HN-BYT",
    phone: "0934.567.890",
    email: "dr.tam@dermatology.vn",
    status: "pending",
    date: "2026-09-24T14:20:00.000Z",
    reviewedBy: null,
    notes: "Đăng ký cung ứng định kỳ Botox Allergan và Juvederm Voluma hàng tháng"
  },
  {
    id: "B2B-APP-101",
    doctorName: "BS. CKI Lê Hoàng",
    clinicName: "Viện Thẩm Mỹ Quốc Tế Paris",
    medicalLicense: "CCHN-003841/BYT",
    phone: "0988.123.456",
    email: "bacsi@7dbio.com",
    status: "approved",
    date: "2026-09-20T09:15:00.000Z",
    reviewedBy: "Hoàng Minh Tuấn (Sales)",
    notes: "Đã xác thực giấy phép CCHN và cấp tài khoản giá sỉ VIP"
  }
];

// --- DEFAULT CUSTOMER REGISTRATION & VERIFICATION REQUESTS (WITH EMAIL ALERTS) ---
const defaultRegistrationRequests = [
  {
    id: "REG-2026-101",
    userId: "USR-CUS-002",
    name: "Đỗ Minh Châu",
    email: "chau.do@prive-beauty.vn",
    phone: "0912.334.455",
    registeredAt: "2026-09-24T18:30:00.000Z",
    notes: "Khách hàng cá nhân cao cấp - Cần tư vấn liệu trình HA & Botulinum chính hãng",
    status: "pending", // "pending" | "approved" | "rejected"
    emailDispatched: true,
    emailSentTo: "admin@7dbio.com",
    emailSubject: "[7DBIO ALERT] Yêu cầu đăng ký tài khoản mới cần xác thực - Đỗ Minh Châu",
    emailBodyHtml: "Khách hàng Đỗ Minh Châu (email: chau.do@prive-beauty.vn, sđt: 0912.334.455) vừa tạo yêu cầu đăng ký tài khoản trên cổng 7Dbio. Vui lòng kiểm tra và xác thực tài khoản để cấp quyền truy cập hệ thống.",
    emailDispatchedAt: "2026-09-24T18:30:05.000Z",
    reviewedBy: null,
    reviewedAt: null
  },
  {
    id: "REG-2026-100",
    userId: "USR-CUS-001",
    name: "Nguyễn Khánh Vy",
    email: "khachhang@7dbio.com",
    phone: "0912.345.678",
    registeredAt: "2026-09-23T10:15:00.000Z",
    notes: "Đăng ký thành viên 7Dbio Privé VIP",
    status: "approved",
    emailDispatched: true,
    emailSentTo: "admin@7dbio.com",
    emailSubject: "[7DBIO ALERT] Yêu cầu đăng ký tài khoản mới cần xác thực - Nguyễn Khánh Vy",
    emailBodyHtml: "Khách hàng Nguyễn Khánh Vy (email: khachhang@7dbio.com, sđt: 0912.345.678) vừa tạo yêu cầu đăng ký tài khoản trên cổng 7Dbio.",
    emailDispatchedAt: "2026-09-23T10:15:04.000Z",
    reviewedBy: "Hoàng Minh Tuấn (Sales)",
    reviewedAt: "2026-09-23T11:00:00.000Z"
  }
];

// --- DEFAULT ADMIN ALERT EMAILS (DISPATCHED ARCHIVE) ---
const defaultAdminEmails = [
  {
    id: "EML-REG-2026-101",
    requestId: "REG-2026-101",
    to: "admin@7dbio.com",
    from: "7Dbio Medical Notification System <no-reply@7dbio.com>",
    subject: "[7DBIO ALERT] Yêu cầu đăng ký tài khoản mới cần xác thực - Đỗ Minh Châu",
    customerName: "Đỗ Minh Châu",
    customerEmail: "chau.do@prive-beauty.vn",
    customerPhone: "0912.334.455",
    notes: "Khách hàng cá nhân cao cấp - Cần tư vấn liệu trình HA & Botulinum chính hãng",
    sentAt: "2026-09-24T18:30:05.000Z",
    status: "delivered"
  },
  {
    id: "EML-REG-2026-100",
    requestId: "REG-2026-100",
    to: "admin@7dbio.com",
    from: "7Dbio Medical Notification System <no-reply@7dbio.com>",
    subject: "[7DBIO ALERT] Yêu cầu đăng ký tài khoản mới cần xác thực - Nguyễn Khánh Vy",
    customerName: "Nguyễn Khánh Vy",
    customerEmail: "khachhang@7dbio.com",
    customerPhone: "0912.345.678",
    notes: "Đăng ký thành viên 7Dbio Privé VIP",
    sentAt: "2026-09-23T10:15:04.000Z",
    status: "delivered"
  }
];

// --- USERS: 5-LEVEL RBAC ARCHITECTURE (2 ACCOUNTS PER INTERNAL LEVEL) ---
const defaultUsers = [
  // --- LEVEL 5: SUPER ADMIN (2 TÀI KHOẢN QUẢN TRỊ VIÊN TỐI CAO) ---
  {
    id: "USR-ADM-001",
    email: "admin@7dbio.com",
    password: "admin123",
    name: "ThS. BS. Luke Nguyễn",
    title: "Tổng Giám Đốc Điều Hành (CEO & Medical Director)",
    department: "Ban Giám Đốc & Hội Đồng Y Khoa",
    role: "super_admin",
    phone: "0988.777.999",
    status: "active",
    verified: true,
    avatar: "LN"
  },
  {
    id: "USR-ADM-002",
    email: "admin2@7dbio.com",
    password: "admin123",
    name: "Đặng Hoàng Long",
    title: "Giám Đốc Vận Hành & Kỹ Thuật (COO & Tech Lead)",
    department: "Ban Giám Đốc & Vận Hành",
    role: "super_admin",
    phone: "0989.666.888",
    status: "active",
    verified: true,
    avatar: "HL"
  },

  // --- LEVEL 4: WAREHOUSE & COLD-CHAIN LOGISTICS (2 TÀI KHOẢN QUẢN LÝ KHO LẠNH GSP) ---
  {
    id: "USR-WHS-001",
    email: "kho.hanoi@7dbio.com",
    password: "kho123",
    name: "DS. Nguyễn Thành Nam",
    title: "Dược Sĩ Trưởng Kho Lạnh GSP Hà Nội",
    department: "Kho Dược & Kiểm Soát Chuỗi Lạnh 2-8°C",
    role: "warehouse_logistics",
    phone: "0973.889.900",
    status: "active",
    verified: true,
    avatar: "TN"
  },
  {
    id: "USR-WHS-002",
    email: "kho.hcm@7dbio.com",
    password: "kho123",
    name: "DS. Phạm Quỳnh Nga",
    title: "Dược Sĩ Trưởng Kho Lạnh GSP TP.HCM",
    department: "Kho Dược & Kiểm Soát Chuỗi Lạnh 2-8°C",
    role: "warehouse_logistics",
    phone: "0975.223.344",
    status: "active",
    verified: true,
    avatar: "QN"
  },

  // --- LEVEL 3: SALES & B2B ACCOUNT MANAGERS (2 TÀI KHOẢN CHUYÊN VIÊN KINH DOANH) ---
  {
    id: "USR-SLS-001",
    email: "sales1@7dbio.com",
    password: "sales123",
    name: "Hoàng Minh Tuấn",
    title: "Senior B2B Account Manager (Khu Vực Miền Bắc)",
    department: "Kinh Doanh & Phát Triển Đối Tác Clinic/Spa",
    role: "sales_rep",
    phone: "0981.112.233",
    status: "active",
    verified: true,
    avatar: "MT"
  },
  {
    id: "USR-SLS-002",
    email: "sales2@7dbio.com",
    password: "sales123",
    name: "Trần Mai Phương",
    title: "Senior B2B Account Manager (Khu Vực Miền Nam)",
    department: "Kinh Doanh & Phát Triển Đối Tác Clinic/Spa",
    role: "sales_rep",
    phone: "0982.445.566",
    status: "active",
    verified: true,
    avatar: "MP"
  },

  // --- LEVEL 2: B2B DOCTORS & CLINICS (ĐỐI TÁC PHÒNG KHÁM / BÁC SĨ ĐÃ THẨM ĐỊNH) ---
  {
    id: "USR-B2B-001",
    email: "bacsi@7dbio.com",
    password: "user123",
    name: "BS. CKI Lê Hoàng",
    title: "Bác Sĩ Chuyên Khoa Thẩm Mỹ",
    clinicName: "Viện Thẩm Mỹ Quốc Tế Paris",
    medicalLicense: "CCHN-003841/BYT",
    role: "b2b_clinic",
    phone: "0988.123.456",
    address: "120 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    status: "active",
    verified: true,
    avatar: "LH"
  },

  // --- LEVEL 1: RETAIL CUSTOMER & PRIVÉ VIP ---
  {
    id: "USR-CUS-001",
    email: "khachhang@7dbio.com",
    password: "user123",
    name: "Nguyễn Khánh Vy",
    title: "Thành Viên 7Dbio Privé VIP (Đã xác thực)",
    role: "customer",
    phone: "0912.345.678",
    address: "88 Lê Lợi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
    status: "active",
    verified: true,
    avatar: "KV"
  },
  {
    id: "USR-CUS-002",
    email: "chau.do@prive-beauty.vn",
    password: "user123",
    name: "Đỗ Minh Châu",
    title: "Khách Hàng (Chờ Ban Quản Trị xác thực)",
    role: "customer",
    phone: "0912.334.455",
    address: "24 Tràng Tiền, Hoàn Kiếm, Hà Nội",
    status: "pending_verification",
    verified: false,
    avatar: "MC"
  }
];

// --- ORDERS WITH TIMELINE & COLD-CHAIN LOGISTICS TRACKING ---
const defaultOrders = [
  {
    id: "ORD-7D9831",
    userEmail: "bacsi@7dbio.com",
    name: "BS. CKI Lê Hoàng",
    clinicName: "Viện Thẩm Mỹ Quốc Tế Paris",
    phone: "0988123456",
    address: "120 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
    paymentMethod: "bank",
    isPaid: true,
    shippingProvider: "ColdChain Express (Thùng lạnh 2-8°C)",
    trackingCode: "7D-CC-98310-VN",
    items: [
      { productId: "prod-3", productName: "Botox Allergan 100 Units", price: 4600000, quantity: 2, batchNo: "AT2026-9" }
    ],
    subtotal: 9200000,
    discountAmount: 920000,
    couponCode: "VIPDOCTOR",
    shippingFee: 0,
    total: 8280000,
    status: "shipping",
    date: "2026-09-24T08:30:00.000Z",
    timeline: [
      { step: "Tạo đơn hàng", time: "24/09/2026 15:30", desc: "Đơn hàng đã được tiếp nhận qua hệ thống B2B" },
      { step: "Thanh toán QR", time: "24/09/2026 15:45", desc: "Kế toán xác nhận nhận đủ tiền chuyển khoản Vietcombank" },
      { step: "Đóng gói lạnh", time: "24/09/2026 16:30", desc: "Kiểm tra nhiệt kế nhiệt độ 3.5°C, niêm phong thùng đá gel chuyên dụng" },
      { step: "Bàn giao vận chuyển", time: "24/09/2026 17:15", desc: "Đã giao đơn vị ColdChain Express, mã vận đơn: 7D-CC-98310-VN" }
    ]
  },
  {
    id: "ORD-7D7294",
    userEmail: "khachhang@7dbio.com",
    name: "Nguyễn Khánh Vy",
    phone: "0912345678",
    address: "88 Lê Lợi, Quận 1, TP. Hồ Chí Minh",
    paymentMethod: "cod",
    isPaid: false,
    shippingProvider: "Giao Hàng Tiêu Chuẩn Y Tế",
    trackingCode: "7D-STD-72940-VN",
    items: [
      { productId: "prod-1", productName: "Juvederm Ultra 4 (2x1ml)", price: 4500000, quantity: 1, batchNo: "VB2026A" }
    ],
    subtotal: 4500000,
    discountAmount: 0,
    couponCode: "",
    shippingFee: 0,
    total: 4500000,
    status: "completed",
    date: "2026-09-20T10:15:00.000Z",
    timeline: [
      { step: "Tạo đơn hàng", time: "20/09/2026 10:15", desc: "Khách hàng tạo đơn với hình thức COD" },
      { step: "Đóng gói chuyên dụng", time: "20/09/2026 11:00", desc: "Sản phẩm được niêm phong tem chống giả 7Dbio" },
      { step: "Giao hàng thành công", time: "21/09/2026 14:20", desc: "Khách hàng đã nhận kiện hàng nguyên vẹn" }
    ]
  }
];

// --- WEBSITE SETTINGS ---
const defaultSocialLinks = { 
  facebook: "https://facebook.com/7dbio", 
  instagram: "https://instagram.com/7dbio", 
  zalo: "https://zalo.me/0988777999" 
};

const defaultSettings = {
  contact: {
    phone: "0988.777.999",
    email: "contact@7dbio.com",
    address: "15 Láng Hạ, Ba Đình, Hà Nội — Chi nhánh HCM: 120 Nguyễn Huệ, Quận 1"
  },
  adminNotificationEmail: "admin@7dbio.com",
  coldChainPolicy: "Toàn bộ sản phẩm Botox và Filler sinh học được lưu trữ tại kho lạnh đạt chuẩn GSP (Good Storage Practice) và vận chuyển bằng thùng bảo ôn kiểm soát nhiệt độ từ 2°C - 8°C, có kèm thiết bị theo dõi nhiệt độ hành trình.",
  privacy: {
    vi: `<h3>1. Thu thập thông tin</h3><p>7Dbio cam kết bảo mật thông tin cá nhân của Quý Bác sĩ và Khách hàng theo tiêu chuẩn bảo mật dữ liệu y tế.</p><h3>2. Bảo mật thông tin</h3><p>Thông tin chỉ phục vụ cho việc xuất hóa đơn VAT, chứng từ kiểm định và điều phối vận chuyển lạnh.</p>`,
    en: `<h3>1. Information Collection</h3><p>7Dbio is strictly committed to protecting personal and clinical data according to healthcare security standards.</p><h3>2. Security Policy</h3><p>Data is exclusively used for VAT invoicing, authenticity certificates, and cold-chain logistics coordination.</p>`,
    zh: `<h3>1. 信息收集</h3><p>7Dbio 严格遵守医疗健康数据安全标准，对医生与客户的个人及机构信息予以保密。</p><h3>2. 安全政策</h3><p>数据仅用于开具发票、正品资质认证以及冷链物流配送。</p>`
  },
  returnPolicy: {
    vi: `<h3>1. Quy định đổi trả Dược - Mỹ phẩm</h3><p>Do tính chất đặc thù của sản phẩm y tế cần kiểm soát nhiệt độ nghiêm ngặt, 7Dbio chỉ hỗ trợ đổi trả nếu thùng hàng có dấu hiệu vi phạm tem niêm phong nhiệt kế hoặc lỗi xác nhận từ nhà sản xuất trong vòng 48h kể từ lúc nhận hàng.</p>`,
    en: `<h3>1. Medical Return Policy</h3><p>Due to cold-chain storage requirements, returns are accepted within 48 hours only if seal indicators are broken or verified manufacturer defects occur upon delivery.</p>`,
    zh: `<h3>1. 医药产品退换货政策</h3><p>由于温控冷链药品的特殊性，仅在签收后48小时内发现封条破损、温控指示异常或确属厂家质量问题时支持退换。</p>`
  }
};

// =======================================================================
// AUTOMATIC MIGRATION & REPOSITORY ACCESSORS (7dbio_v2_*)
// =======================================================================

const initDatabase = () => {
  const currentVer = localStorage.getItem("7dbio_schema_version");

  // Migration from older schema or fresh install
  if (!currentVer || currentVer !== SCHEMA_VERSION) {
    // Refresh products with complete 8-item catalog
    localStorage.setItem("7dbio_v2_products", JSON.stringify(defaultProducts));

    // Brands & Indications
    localStorage.setItem("7dbio_v2_brands", JSON.stringify(defaultBrands));
    localStorage.setItem("7dbio_v2_indications", JSON.stringify(defaultIndications));

    // Wishlist
    if (!localStorage.getItem("7dbio_v2_wishlist")) {
      localStorage.setItem("7dbio_v2_wishlist", JSON.stringify(["prod-1", "prod-3"]));
    }

    // Serials for anti-counterfeit
    if (!localStorage.getItem("7dbio_v2_serials")) {
      localStorage.setItem("7dbio_v2_serials", JSON.stringify(defaultSerials));
    }

    // Coupons
    if (!localStorage.getItem("7dbio_v2_coupons")) {
      localStorage.setItem("7dbio_v2_coupons", JSON.stringify(defaultCoupons));
    }

    // Users (Always refresh on schema upgrade to include internal roles)
    localStorage.setItem("7dbio_v2_users", JSON.stringify(defaultUsers));

    // Registration Requests & Admin Email Alerts
    localStorage.setItem("7dbio_v2_reg_requests", JSON.stringify(defaultRegistrationRequests));
    localStorage.setItem("7dbio_v2_admin_emails", JSON.stringify(defaultAdminEmails));

    // B2B Applications
    localStorage.setItem("7dbio_v2_b2b_apps", JSON.stringify(defaultB2BApplications));

    // Orders
    if (!localStorage.getItem("7dbio_v2_orders")) {
      localStorage.setItem("7dbio_v2_orders", JSON.stringify(defaultOrders));
    }

    // Socials & Settings
    if (!localStorage.getItem("7dbio_v2_socials")) {
      localStorage.setItem("7dbio_v2_socials", JSON.stringify(defaultSocialLinks));
    }
    if (!localStorage.getItem("7dbio_v2_settings")) {
      localStorage.setItem("7dbio_v2_settings", JSON.stringify(defaultSettings));
    }

    localStorage.setItem("7dbio_schema_version", SCHEMA_VERSION);
  }
};

// Execute initialization
initDatabase();

// --- REPOSITORY FUNCTIONS ---

const getRegistrationRequests = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_reg_requests")) || defaultRegistrationRequests;
};

const setRegistrationRequests = (data) => {
  localStorage.setItem("7dbio_v2_reg_requests", JSON.stringify(data));
};

const getAdminEmails = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_admin_emails")) || defaultAdminEmails;
};

const setAdminEmails = (data) => {
  localStorage.setItem("7dbio_v2_admin_emails", JSON.stringify(data));
};

const dispatchAdminRegistrationEmail = ({ name, email, phone, notes }) => {
  const settings = getSettings();
  const adminEmail = settings.adminNotificationEmail || "admin@7dbio.com";
  const now = new Date();
  const dateStr = now.toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });

  const emailRecord = {
    id: "EML-" + Date.now(),
    to: adminEmail,
    from: "system-alerts@7dbio.com",
    subject: `[7DBIO ALERT] Yêu cầu xác thực tài khoản mới: ${name} (${email})`,
    bodyText: `Kính gửi Quản trị viên 7Dbio,\n\nHệ thống ghi nhận 01 yêu cầu đăng ký tài khoản khách hàng mới cần xác thực thông tin:\n- Họ và tên: ${name}\n- Email: ${email}\n- Số điện thoại: ${phone || 'Chưa cung cấp'}\n- Nhu cầu / Ghi chú: ${notes || 'Thành viên Privé tìm hiểu dịch vụ'}\n- Thời gian đăng ký: ${dateStr}\n\nVui lòng truy cập Bảng Điều Khiển Admin > Phân hệ "Xác thực Khách hàng" để kiểm tra và kích hoạt tài khoản.\n\nTrân trọng,\n7Dbio Automated Security Gateway`,
    customerName: name,
    customerEmail: email,
    customerPhone: phone,
    customerNotes: notes,
    sentAt: now.toISOString(),
    status: "delivered"
  };

  const emails = getAdminEmails();
  emails.unshift(emailRecord);
  setAdminEmails(emails);

  return emailRecord;
};

const approveCustomerRegistration = (requestId, reviewerName = "Admin") => {
  const reqs = getRegistrationRequests();
  const rIdx = reqs.findIndex(r => r.id === requestId);
  if (rIdx === -1) return false;

  const req = reqs[rIdx];
  req.status = "approved";
  req.reviewedBy = reviewerName;
  req.reviewedAt = new Date().toISOString();
  setRegistrationRequests(reqs);

  // Update corresponding user to active & verified
  const users = getUsers();
  const uIdx = users.findIndex(u => u.email.toLowerCase() === req.email.toLowerCase());
  if (uIdx > -1) {
    users[uIdx].status = "active";
    users[uIdx].verified = true;
    setUsers(users);
  }

  return true;
};

const rejectCustomerRegistration = (requestId, reviewerName = "Admin", reason = "") => {
  const reqs = getRegistrationRequests();
  const rIdx = reqs.findIndex(r => r.id === requestId);
  if (rIdx === -1) return false;

  const req = reqs[rIdx];
  req.status = "rejected";
  req.reviewedBy = reviewerName;
  req.reviewedAt = new Date().toISOString();
  req.rejectReason = reason;
  setRegistrationRequests(reqs);

  const users = getUsers();
  const uIdx = users.findIndex(u => u.email.toLowerCase() === req.email.toLowerCase());
  if (uIdx > -1) {
    users[uIdx].status = "rejected";
    users[uIdx].verified = false;
    setUsers(users);
  }

  return true;
};

// --- REPOSITORY FUNCTIONS ---

const getB2BApplications = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_b2b_apps")) || defaultB2BApplications;
};

const setB2BApplications = (data) => {
  localStorage.setItem("7dbio_v2_b2b_apps", JSON.stringify(data));
};

const getProducts = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_products")) || defaultProducts;
};

const setProducts = (data) => {
  localStorage.setItem("7dbio_v2_products", JSON.stringify(data));
};

const getWishlist = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_wishlist")) || [];
};

const setWishlist = (data) => {
  localStorage.setItem("7dbio_v2_wishlist", JSON.stringify(data));
};

const toggleWishlistItem = (productId) => {
  let list = getWishlist();
  const idx = list.indexOf(productId);
  let added = false;
  if (idx > -1) {
    list.splice(idx, 1);
    added = false;
  } else {
    list.push(productId);
    added = true;
  }
  setWishlist(list);
  return { added, list };
};

const isInWishlist = (productId) => {
  const list = getWishlist();
  return list.includes(productId);
};

const getBrands = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_brands")) || defaultBrands;
};

const getIndications = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_indications")) || defaultIndications;
};

const getSerials = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_serials")) || defaultSerials;
};

const verifySerialCode = (code) => {
  if (!code) return null;
  const cleanCode = code.trim().toUpperCase();
  const list = getSerials();
  const found = list.find(s => s.serial.toUpperCase() === cleanCode);
  if (found) {
    found.checkCount = (found.checkCount || 0) + 1;
    found.lastCheckedAt = new Date().toISOString();
    localStorage.setItem("7dbio_v2_serials", JSON.stringify(list));
  }
  return found || null;
};

const getCoupons = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_coupons")) || defaultCoupons;
};

const applyCouponCode = (code, subtotal) => {
  if (!code) return { success: false, message: "Mã giảm giá trống" };
  const cleanCode = code.trim().toUpperCase();
  const coupons = getCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === cleanCode);
  
  if (!coupon) {
    return { success: false, message: "Mã giảm giá không tồn tại hoặc đã hết hạn." };
  }
  if (coupon.minOrder && subtotal < coupon.minOrder) {
    return { success: false, message: `Mã chỉ áp dụng cho đơn từ ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.minOrder)}` };
  }

  let discount = 0;
  if (coupon.freeShipping) {
    return { success: true, coupon, discount: 0, isFreeShip: true, message: "Đã áp dụng mã Miễn phí vận chuyển lạnh!" };
  } else if (coupon.discountPercent) {
    discount = Math.round((subtotal * coupon.discountPercent) / 100);
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }
  } else if (coupon.discountAmount) {
    discount = coupon.discountAmount;
  }

  return { success: true, coupon, discount, isFreeShip: false, message: `Áp dụng thành công mã ${coupon.code}!` };
};

const getUsers = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_users")) || defaultUsers;
};

const setUsers = (data) => {
  localStorage.setItem("7dbio_v2_users", JSON.stringify(data));
};

const getOrders = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_orders")) || defaultOrders;
};

const setOrders = (data) => {
  localStorage.setItem("7dbio_v2_orders", JSON.stringify(data));
};

const getSocialLinks = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_socials")) || defaultSocialLinks;
};

const setSocialLinks = (data) => {
  localStorage.setItem("7dbio_v2_socials", JSON.stringify(data));
};

const getSettings = () => {
  return JSON.parse(localStorage.getItem("7dbio_v2_settings")) || defaultSettings;
};

const setSettings = (data) => {
  localStorage.setItem("7dbio_v2_settings", JSON.stringify(data));
};

// Global App States
let currentLang = localStorage.getItem('7dbio_lang') || localStorage.getItem('puredermi_lang') || 'vi';
let currentUser = JSON.parse(sessionStorage.getItem("7dbio_current_user")) || JSON.parse(sessionStorage.getItem("puredermi_current_user")) || null;
let currentCart = JSON.parse(localStorage.getItem("7dbio_v2_cart")) || JSON.parse(localStorage.getItem("puredermi_cart")) || [];
let activeCategory = "all";
let activeBrand = "all";
let activeIndication = "all";
let activeSort = "featured";
let activeGridView = "4";
let appliedCoupon = null;
let settingsEditLang = 'vi';

// Helper: Translation lookup
const t = (key) => (translations[currentLang] || translations['vi'])[key] || key;
