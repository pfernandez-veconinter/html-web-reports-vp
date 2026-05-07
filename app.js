const API_ORIGIN = "https://vecopulse.vecoaccess.com";
const COUNTRY_DISPLAY = {
  TT: "Trinidad y Tobago",
  VE: "Venezuela",
  BR: "Brasil",
  US: "Estados Unidos",
  REPORTS: "Reportes"
};

const ENDPOINTS_BY_COUNTRY = {
  TT: [
    {
      key: "scotiabank-transactions",
      label: "ScotiaBank - Buscar transaccion",
      method: "GET",
      path: "/api/V{version}/TT/ScotiaBank/transactions",
      queryParams: [
        { name: "IdTransaction", required: true, placeholder: "VECOTT-105578104132806" }
      ]
    }
  ],
  VE: [
    {
      key: "banesco-consultas-transaction",
      label: "BanescoConsultas - Validar transaccion",
      method: "GET",
      path: "/api/V{version}/VE/BanescoConsultas/transaction",
      queryParams: [
        { name: "device", required: false, placeholder: "Samsung A55" },
        { name: "ipAddress", required: false, placeholder: "10.150.15.103" },
        { name: "deviceType", required: false, placeholder: "mobile" },
        { name: "referenceNumber", required: false, placeholder: "00000118386" },
        { name: "date", required: false, placeholder: "2026-05-07T10:00:00" },
        { name: "bank", required: false, placeholder: "defaultBank" },
        { name: "amount", required: false, placeholder: "0" }
      ]
    },
    {
      key: "banesco-pagos-transactions",
      label: "BanescoPagos - Buscar transaccion",
      method: "GET",
      path: "/api/V{version}/VE/BanescoPagos/transactions",
      queryParams: [
        { name: "IdTransaction", required: true, placeholder: "VECO5739487214" }
      ]
    },
    {
      key: "bbva-transactions",
      label: "BBVA - Buscar transaccion",
      method: "GET",
      path: "/api/V{version}/VE/BBVA/transactions",
      queryParams: [
        { name: "IdTransaction", required: true, placeholder: "VECO5739487214" }
      ]
    },
    {
      key: "bnc-transactions",
      label: "BNC - Buscar transaccion",
      method: "GET",
      path: "/api/V{version}/VE/BNC/transactions",
      queryParams: [
        { name: "IdTransaction", required: true, placeholder: "VECO5739487214" },
        { name: "Monto", required: true, placeholder: "120.50" },
        { name: "Fecha", required: true, placeholder: "2026-05-07" }
      ]
    },
    {
      key: "bnc-alltransactions",
      label: "BNC - Listado de transacciones",
      method: "GET",
      path: "/api/V{version}/VE/BNC/alltransactions",
      queryParams: []
    },
    {
      key: "megasoft-consulta-transaccion",
      label: "Megasoft - Consulta de transaccion",
      method: "GET",
      path: "/api/V{version}/VE/Megasoft/TDC/ConsultaTransaccion",
      queryParams: [
        { name: "numeroControl", required: true, placeholder: "123456" },
        { name: "monto", required: true, placeholder: "10.50" },
        { name: "transaccionAConsultarVecoVE", required: true, placeholder: "VECO123456" },
        { name: "tipo", required: true, placeholder: "TDC" }
      ]
    }
  ],
  BR: [
    {
      key: "bradesco-token-test",
      label: "BradescoPIX - Validar acceso",
      method: "GET",
      path: "/api/V{version}/BR/BradescoPIX/TokenTest",
      queryParams: []
    },
    {
      key: "bradesco-transaction-by-order",
      label: "BradescoPIX - Buscar por orden",
      method: "GET",
      path: "/api/V{version}/BR/BradescoPIX/TransactionByOrder/{orderId}",
      pathParams: [
        { name: "orderId", required: true, placeholder: "ORDER-1001" }
      ],
      queryParams: []
    },
    {
      key: "bradesco-transaction-search",
      label: "BradescoPIX - Busqueda general",
      method: "GET",
      path: "/api/V{version}/BR/BradescoPIX/TransactionSearch",
      queryParams: [
        { name: "query", required: false, placeholder: "clientId, orderId, amount" }
      ]
    }
  ],
  US: [
    {
      key: "stripe-get-payment",
      label: "Stripe - Buscar pago",
      method: "GET",
      path: "/api/V{version}/US/Stripe/GetPaymentFromStripe/{orderId}",
      pathParams: [
        { name: "orderId", required: true, placeholder: "VECOUS-123456" }
      ],
      queryParams: []
    },
    {
      key: "stripe-transaction-by-order",
      label: "Stripe - Buscar por orden",
      method: "GET",
      path: "/api/V{version}/US/Stripe/TransactionByOrder/{orderId}",
      pathParams: [
        { name: "orderId", required: true, placeholder: "VECOUS-123456" }
      ],
      queryParams: []
    },
    {
      key: "stripe-transaction-search",
      label: "Stripe - Busqueda general",
      method: "GET",
      path: "/api/V{version}/US/Stripe/StripeTransactionSearch",
      queryParams: [
        { name: "query", required: false, placeholder: "orderId, username, amount" }
      ]
    }
  ],
  REPORTS: [
    {
      key: "reports-payment-metrics-excel",
      label: "Reportes - Exportar reporte",
      method: "GET",
      path: "/api/V{version}/Reports/PaymentMetrics/ExcelReport",
      queryParams: [
        { name: "startDate", required: true, placeholder: "2026-05-01" },
        { name: "endDate", required: true, placeholder: "2026-05-07" }
      ]
    },
    {
      key: "reports-payment-metrics-send",
      label: "Reportes - Envio de reporte",
      method: "GET",
      path: "/api/V{version}/Reports/PaymentMetrics/send",
      queryParams: []
    }
  ]
};

const searchForm = document.getElementById("searchForm");
const countryMenu = document.getElementById("countryMenu");
const endpointSelect = document.getElementById("endpointSelect");
const dynamicFieldsRow = document.getElementById("dynamicFieldsRow");
const searchBtn = document.getElementById("searchBtn");
const loadingState = document.getElementById("loadingState");
const resultSection = document.getElementById("resultSection");
const mainData = document.getElementById("mainData");
const rawData = document.getElementById("rawData");
const fullJson = document.getElementById("fullJson");

let selectedCountry = "TT";
let currentEndpoints = [];

function renderKeyValue(container, key, value) {
  const col = document.createElement("div");
  col.className = "col-md-4 col-sm-6";

  const label = document.createElement("div");
  label.className = "key-label";
  label.textContent = key;

  const val = document.createElement("div");
  val.className = "value-text";
  val.textContent = value === null || value === undefined || value === "" ? "N/A" : String(value);

  col.appendChild(label);
  col.appendChild(val);
  container.appendChild(col);
}

function setLoading(isLoading) {
  searchBtn.disabled = isLoading;
  loadingState.classList.toggle("d-none", !isLoading);
}

function resetResults() {
  mainData.innerHTML = "";
  rawData.innerHTML = "";
  fullJson.textContent = "";
  resultSection.classList.add("d-none");
}

function showErrorModal(title, message) {
  Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonText: "Entendido"
  });
}

function formatFieldName(name) {
  return String(name)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();
}

function parsePotentialJson(value) {
  if (!value || typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function renderResponse(payload) {
  const isObject = payload && typeof payload === "object";
  const data = isObject && payload.data && typeof payload.data === "object" ? payload.data : null;

  if (isObject) {
    Object.entries(payload).forEach(([key, value]) => {
      if (typeof value !== "object" || value === null) {
        renderKeyValue(mainData, key, value);
      }
    });
  } else {
    renderKeyValue(mainData, "response", payload);
  }

  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (key !== "rawResponse" && (typeof value !== "object" || value === null)) {
        renderKeyValue(rawData, key, value);
      }
    });

    const raw = data.rawResponse || data.raw;
    const parsedRaw = typeof raw === "object" ? raw : parsePotentialJson(raw);

    if (parsedRaw && typeof parsedRaw === "object") {
      Object.entries(parsedRaw).forEach(([key, value]) => {
        renderKeyValue(rawData, key, value);
      });
    }
  }

  fullJson.textContent = JSON.stringify(payload, null, 2);
  resultSection.classList.remove("d-none");
}

function getCurrentEndpoint() {
  const endpointKey = endpointSelect.value;
  return currentEndpoints.find((ep) => ep.key === endpointKey) || null;
}

function createFieldInput(field, typeLabel) {
  const col = document.createElement("div");
  col.className = "col-md-4";

  const label = document.createElement("label");
  label.className = "form-label";
  label.setAttribute("for", `param-${typeLabel}-${field.name}`);
  label.textContent = formatFieldName(field.name);

  const input = document.createElement("input");
  input.className = "form-control";
  input.id = `param-${typeLabel}-${field.name}`;
  input.name = `param-${typeLabel}-${field.name}`;
  input.dataset.paramName = field.name;
  input.dataset.paramType = typeLabel;
  input.placeholder = field.placeholder || "";
  input.required = !!field.required;

  col.appendChild(label);
  col.appendChild(input);
  return col;
}

function renderDynamicFields() {
  dynamicFieldsRow.innerHTML = "";
  const endpoint = getCurrentEndpoint();

  if (!endpoint) {
    return;
  }

  const pathParams = endpoint.pathParams || [];
  const queryParams = endpoint.queryParams || [];

  pathParams.forEach((field) => {
    dynamicFieldsRow.appendChild(createFieldInput(field, "path"));
  });

  queryParams.forEach((field) => {
    dynamicFieldsRow.appendChild(createFieldInput(field, "query"));
  });
}

function renderEndpointSelect() {
  endpointSelect.innerHTML = "";
  currentEndpoints.forEach((endpoint) => {
    const option = document.createElement("option");
    option.value = endpoint.key;
    option.textContent = endpoint.label;
    endpointSelect.appendChild(option);
  });

  renderDynamicFields();
}

function renderCountryMenu() {
  countryMenu.innerHTML = "";

  Object.keys(ENDPOINTS_BY_COUNTRY).forEach((country) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `btn btn-sm text-start country-btn ${country === selectedCountry ? "btn-primary" : "btn-outline-primary"}`;
    button.textContent = `${country} - ${COUNTRY_DISPLAY[country] || country}`;
    button.addEventListener("click", () => {
      selectedCountry = country;
      currentEndpoints = ENDPOINTS_BY_COUNTRY[country] || [];
      renderCountryMenu();
      renderEndpointSelect();
      resetResults();
    });

    countryMenu.appendChild(button);
  });
}

function collectParams() {
  const pathValues = {};
  const queryValues = {};
  const allInputs = dynamicFieldsRow.querySelectorAll("input");

  allInputs.forEach((input) => {
    const name = input.dataset.paramName;
    const type = input.dataset.paramType;
    const value = input.value.trim();

    if (type === "path") {
      pathValues[name] = value;
    }

    if (type === "query") {
      queryValues[name] = value;
    }
  });

  return { pathValues, queryValues };
}

function buildRequestUrl(endpoint) {
  const version = "1";

  const { pathValues, queryValues } = collectParams();

  let path = endpoint.path.replace("{version}", version);
  (endpoint.pathParams || []).forEach((param) => {
    const val = pathValues[param.name] || "";
    if (param.required && !val) {
      throw new Error(`Falta completar: ${formatFieldName(param.name)}.`);
    }
    path = path.replace(`{${param.name}}`, encodeURIComponent(val));
  });

  const query = new URLSearchParams();
  (endpoint.queryParams || []).forEach((param) => {
    const val = queryValues[param.name] || "";
    if (param.required && !val) {
      throw new Error(`Falta completar: ${formatFieldName(param.name)}.`);
    }
    if (val) {
      query.append(param.name, val);
    }
  });

  const qs = query.toString();
  return `${API_ORIGIN}${path}${qs ? `?${qs}` : ""}`;
}

endpointSelect.addEventListener("change", () => {
  renderDynamicFields();
  resetResults();
});

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  resetResults();

  try {
    const endpoint = getCurrentEndpoint();
    if (!endpoint) {
      showErrorModal("Falta seleccionar consulta", "Selecciona un tipo de consulta para continuar.");
      return;
    }

    const requestUrl = buildRequestUrl(endpoint);
    setLoading(true);

    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    });

    let payload = null;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json") || contentType.includes("text/json")) {
      payload = await response.json();
    } else {
      payload = await response.text();
    }

    if (!response.ok) {
      if (response.status === 404) {
        showErrorModal("Error 404", "No se encontraron datos para la consulta indicada.");
        return;
      }

      if (response.status === 500) {
        showErrorModal("Error 500", "El servidor presentó un error interno.");
        return;
      }

      const message = typeof payload === "object" && payload?.message ? payload.message : "No se pudo procesar la solicitud.";
      showErrorModal(`Error ${response.status}`, message);
      return;
    }

    renderResponse(payload);
  } catch (error) {
    showErrorModal("No se pudo completar la consulta", error.message || "Intenta nuevamente en unos minutos.");
  } finally {
    setLoading(false);
  }
});

function initialize() {
  currentEndpoints = ENDPOINTS_BY_COUNTRY[selectedCountry] || [];
  renderCountryMenu();
  renderEndpointSelect();

  const firstIdInput = document.getElementById("param-query-IdTransaction");
  if (firstIdInput) {
    firstIdInput.value = "VECOTT-105578104132806";
  }
}

initialize();
