export function formatDate(string: string) {
  if (!string) {
    return "-";
  }
  const { $dayjs } = useNuxtApp();
  return $dayjs(string).format("DD MMM YYYY HH:mm:ss");
}

export function toCurrency(val: number) {
  var formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
  return formatter.format(val);
}

export function simpananTypeToText(val: number) {
  if (val === 0) {
    return "Debit";
  } else if (val === 1) {
    return "Kredit";
  }
  return "Unknown";
}

export function toMoney(val: number) {
  if (val) {
    const x = val;
    return x.toLocaleString("id-ID");
  } else {
    return "-";
  }
}

export function simpleDate(string: string) {
  if (!string) {
    return "-";
  }
  const { $dayjs } = useNuxtApp();
  return $dayjs(string).format("DD/MM/YYYY");
}

export function toDate(string: string) {
  if (!string) {
    return "-";
  }
  const { $dayjs } = useNuxtApp();
  return $dayjs(string).format("DD MMM YYYY");
}

export function toMonth(string: string) {
  if (!string) {
    return;
  }
  const { $dayjs } = useNuxtApp();
  return $dayjs(string).format("MMMM YYYY");
}

export function toViewer(val: boolean) {
  return val ? "Public" : "Private";
}

export function truncateTitle(val: string) {
  if (!val) {
    return "";
  }
  const string = val.length > 80 ? val.substring(0, 77) + "..." : val;
  return string;
}
