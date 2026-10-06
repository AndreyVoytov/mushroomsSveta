(() => {
  "use strict";

  const STORAGE_KEY = "mushroomsSveta.mechanics.v1";
  const DELETED_KEY = `${STORAGE_KEY}.deleted`;
  const STATUSES = ["Идея", "На рассмотрении", "В работе", "На тестировании", "Готово", "В игре"];
  const PRIORITIES = ["Высокий", "Средний", "Низкий"];
  const PRIORITY_ORDER = { "Высокий": 0, "Средний": 1, "Низкий": 2 };
  const STATUS_ORDER = { "В работе": 0, "На тестировании": 1, "На рассмотрении": 2, "Идея": 3, "Готово": 4, "В игре": 5 };
  const SEED_TIMESTAMP = "2000-01-01T00:00:00.000Z";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const elements = {
    list: $("#mechanicList"), search: $("#searchInput"), status: $("#statusFilter"),
    priority: $("#priorityFilter"), tag: $("#tagFilter"), sort: $("#sortFilter"), visible: $("#visibleCount"),
    filterToggle: $("#filterToggleButton"), filterFields: $("#filterFields"),
    cloudLogin: $("#cloudLoginButton"),
    importButton: $("#importButton"), importFile: $("#importFile"),
    total: $("#totalCount"), ideas: $("#ideaCount"), summary: $("#resultSummary"), empty: $("#emptyState"),
    dialog: $("#detailDialog"), dialogContent: $("#dialogContent"), imageDialog: $("#imageDialog"), largeImage: $("#largeImage"),
    imageCaption: $("#imageCaption"), copyImage: $("#copyImageButton"), toast: $("#toast")
  };
  const state = {
    items: [], deletedIds: new Set(), selectedId: null, dialogMode: "view", draft: null, draftIsNew: false,
    imageToCopy: null, cloudClient: null, cloudConfigured: false, cloudReady: false, cloudSession: null,
    cloudOwner: false, cloudSaveTimer: null
  };
  const imageUrls = new Map();
  const temporaryUrls = new Set();
  let imageDbPromise;
  let toastTimer;

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function normalizeLevel(value) {
    if (value === null || value === undefined || value === "") return null;
    const level = Number(value);
    return Number.isFinite(level) && level > 0 ? Math.floor(level) : null;
  }

  function normalizeFocus(value) {
    const focus = value && typeof value === "object" ? value : {};
    const coordinate = number => Math.max(0, Math.min(100, Number.isFinite(Number(number)) ? Number(number) : 50));
    return { x: coordinate(focus.x), y: coordinate(focus.y) };
  }

  function seedFor(id) {
    return (window.MECHANIC_SEED || []).find(item => item.id === id);
  }

  function nextSyntheticLevel() {
    const max = state.items.reduce((highest, item) => {
      const level = normalizeLevel(item.appearanceLevel);
      return level !== null && level >= 99000 ? Math.max(highest, level) : highest;
    }, 99000);
    return max + 1;
  }

  function uid(prefix = "note") {
    const random = window.crypto && typeof window.crypto.randomUUID === "function"
      ? window.crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
    return `${prefix}-${Date.now().toString(36)}-${random}`;
  }

  function cleanStoredItem(item) {
    const seed = seedFor(item.id);
    const storedFields = { ...item };
    delete storedFields.legacyTitle;
    const description = String(item.description || "");
    const hasAppearanceLevel = Object.prototype.hasOwnProperty.call(item, "appearanceLevel");
    return {
      ...storedFields,
      title: String(item.title || ""),
      description,
      shortDescription: String(item.shortDescription || makeShortDescription(description)),
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      images: Array.isArray(item.images) ? item.images.map(image => ({ ...image })) : [],
      priority: PRIORITIES.includes(item.priority) ? item.priority : "Средний",
      status: String(item.status || "На рассмотрении"),
      source: String(item.source || "Пользовательская"),
      origin: String(item.origin || "Добавлена вручную"),
      appearanceLevel: hasAppearanceLevel ? normalizeLevel(item.appearanceLevel) : normalizeLevel(seed && seed.appearanceLevel),
      focus: normalizeFocus(item.focus || (seed && seed.focus)),
      updatedAt: item.updatedAt || new Date().toISOString()
    };
  }

  function makeShortDescription(description) {
    const text = String(description || "").trim();
    const firstSentence = text.match(/^.*?[.!?](?=\s|$)/u)?.[0] || text;
    return firstSentence.length > 140 ? `${firstSentence.slice(0, 137).trimEnd()}…` : firstSentence;
  }

  function cloudConfig() {
    return window.MECHANIC_CLOUD_CONFIG || {};
  }

  function canEditCatalog() {
    return !state.cloudConfigured || (state.cloudReady && state.cloudOwner);
  }

  function updateCloudControls() {
    if (elements.cloudLogin) {
      elements.cloudLogin.hidden = !state.cloudConfigured;
      elements.cloudLogin.textContent = state.cloudOwner ? "Выйти" : "Войти";
      elements.cloudLogin.title = state.cloudOwner ? "Выйти из общей базы" : "Войти, чтобы редактировать общий каталог";
      elements.cloudLogin.disabled = state.cloudConfigured && !state.cloudClient;
    }
    const addButton = $("#newItemButton");
    if (addButton) {
      addButton.disabled = !canEditCatalog();
      addButton.title = canEditCatalog() ? "" : "Войдите в аккаунт владельца, чтобы редактировать каталог";
    }
    if (elements.importButton) elements.importButton.disabled = !canEditCatalog();
  }

  function scheduleCloudSave() {
    if (!state.cloudReady || !state.cloudOwner || !state.cloudClient) return;
    window.clearTimeout(state.cloudSaveTimer);
    state.cloudSaveTimer = window.setTimeout(() => {
      syncCloudCatalog().catch(error => {
        console.error("Не удалось синхронизировать каталог с Supabase", error);
        toast("Не удалось синхронизировать с общей базой. Проверьте соединение.");
      });
    }, 450);
  }

  function saveItems() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items.map(cleanStoredItem)));
      scheduleCloudSave();
      return true;
    } catch (error) {
      console.error("Не удалось сохранить каталог", error);
      toast("Не удалось сохранить список в браузере. Проверь доступное место для данных.");
      return false;
    }
  }

  function saveDeletedIds() {
    try {
      localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(state.deletedIds)));
      scheduleCloudSave();
      return true;
    } catch (error) {
      console.error("Не удалось сохранить список удалённых карточек", error);
      toast("Не удалось сохранить изменение в браузере.");
      return false;
    }
  }

  function loadItems() {
    let loaded = [];
    try {
      const deleted = JSON.parse(localStorage.getItem(DELETED_KEY) || "[]");
      state.deletedIds = new Set(Array.isArray(deleted) ? deleted : []);
    } catch (_) {
      state.deletedIds = new Set();
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) loaded = JSON.parse(stored);
    } catch (error) {
      console.warn("Сохранённый список повреждён; загружаем исходный каталог.", error);
    }

    const items = Array.isArray(loaded) ? loaded.map(stored => {
      const item = cleanStoredItem(stored);
      const seed = seedFor(item.id);
      if (seed && (Number(item.seedAssetsVersion) || 0) < 2) {
        if (item.appearanceLevel === null && normalizeLevel(seed.appearanceLevel) !== null) {
          item.appearanceLevel = normalizeLevel(seed.appearanceLevel);
        }
        if (Array.isArray(seed.images) && seed.images.length) {
          const existingIds = new Set(item.images.map(image => image.id).filter(Boolean));
          item.images.push(...copy(seed.images.filter(image => !existingIds.has(image.id))));
        }
        item.seedAssetsVersion = 2;
      }
      if (seed && (Number(item.seedAssetsVersion) || 0) < 3) {
        if (seed.legacyTitle && item.title === seed.legacyTitle) item.title = seed.title;
        if (seed.shortDescription) item.shortDescription = seed.shortDescription;
        const savedFocus = normalizeFocus(item.focus);
        const seedFocus = normalizeFocus(seed.focus);
        if (savedFocus.x === 50 && savedFocus.y === 50) item.focus = seedFocus;
        item.seedAssetsVersion = 3;
      }
      return item;
    }) : [];
    const knownIds = new Set(items.map(item => item.id));
    (window.MECHANIC_SEED || []).forEach(seed => {
      if (!knownIds.has(seed.id) && !state.deletedIds.has(seed.id)) items.push(cleanStoredItem({ ...copy(seed), seedAssetsVersion: 3, updatedAt: seed.updatedAt || SEED_TIMESTAMP }));
    });
    state.items = items;
    saveItems();
  }

  async function syncCloudCatalog() {
    if (!state.cloudClient || !state.cloudReady || !state.cloudOwner) return;
    const records = state.items.map(item => ({
      id: item.id,
      payload: cleanStoredItem(item),
      is_deleted: false,
      updated_at: item.updatedAt || new Date().toISOString()
    }));
    state.deletedIds.forEach(id => records.push({
      id,
      payload: null,
      is_deleted: true,
      updated_at: new Date().toISOString()
    }));
    const { error } = await state.cloudClient.from("mechanics_items").upsert(records, { onConflict: "id" });
    if (error) throw error;
  }

  async function loadCloudCatalog() {
    if (!state.cloudClient) return;
    const { data, error } = await state.cloudClient
      .from("mechanics_items")
      .select("id,payload,is_deleted,updated_at");
    if (error) throw error;

    const previousItems = state.items.map(item => cleanStoredItem(item));
    const deleted = new Set(state.deletedIds);
    const cloudItems = new Map();
    (data || []).forEach(record => {
      if (record.is_deleted) deleted.add(record.id);
      else if (record.payload) {
        const item = cleanStoredItem({ ...record.payload, updatedAt: record.payload.updatedAt || record.updated_at });
        cloudItems.set(item.id, item);
      }
    });

    previousItems.forEach(localItem => {
      if (deleted.has(localItem.id)) return;
      const savedItem = cloudItems.get(localItem.id);
      if (!savedItem || Date.parse(localItem.updatedAt || 0) > Date.parse(savedItem.updatedAt || 0)) {
        cloudItems.set(localItem.id, localItem);
      }
    });
    (window.MECHANIC_SEED || []).forEach(seed => {
      if (!deleted.has(seed.id) && !cloudItems.has(seed.id)) cloudItems.set(seed.id, cleanStoredItem({ ...seed, updatedAt: seed.updatedAt || SEED_TIMESTAMP }));
    });

    state.cloudReady = false;
    state.deletedIds = deleted;
    state.items = Array.from(cloudItems.values()).filter(item => !deleted.has(item.id));
    saveItems();
    saveDeletedIds();
    state.cloudReady = true;
    updateCloudControls();
    if (state.cloudOwner) await syncCloudCatalog();
  }

  async function initializeCloud() {
    const config = cloudConfig();
    const publicKey = config.publishableKey || config.anonKey;
    if (!config.url || !publicKey) return;
    state.cloudConfigured = true;
    updateCloudControls();

    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
        script.onload = resolve;
        script.onerror = () => reject(new Error("Не удалось загрузить библиотеку Supabase."));
        document.head.append(script);
      });
    }
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      throw new Error("Библиотека Supabase недоступна в браузере.");
    }

    state.cloudClient = window.supabase.createClient(config.url, publicKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    state.cloudClient.auth.onAuthStateChange((event, session) => {
      state.cloudSession = session;
      if (event === "SIGNED_OUT") state.cloudOwner = false;
      updateCloudControls();
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        window.setTimeout(async () => {
          try {
            state.cloudOwner = await isCloudOwner(session);
            updateCloudControls();
            await loadCloudCatalog();
            renderList();
          } catch (error) {
            console.error("Не удалось загрузить общий каталог", error);
            toast("Общая база недоступна. Локальные данные не потеряны.");
          }
        }, 0);
      }
    });

    const { data, error } = await state.cloudClient.auth.getSession();
    if (error) throw error;
    state.cloudSession = data.session;
    state.cloudOwner = await isCloudOwner(data.session);
    await loadCloudCatalog();
  }

  async function isCloudOwner(session) {
    if (!session?.user || !state.cloudClient) return false;
    const { data, error } = await state.cloudClient.rpc("is_mechanics_owner");
    if (error) throw error;
    return data === true;
  }

  async function handleCloudLogin() {
    if (!state.cloudClient) {
      toast("Сначала настройте подключение Supabase.");
      return;
    }
    if (state.cloudOwner) {
      const { error } = await state.cloudClient.auth.signOut();
      if (error) toast(error.message || "Не удалось выйти из общей базы.");
      return;
    }
    const email = window.prompt("Введите email владельца каталога:");
    if (!email) return;
    const redirectTo = `${window.location.origin}${window.location.pathname}`;
    const { error } = await state.cloudClient.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true }
    });
    if (error) toast(error.message || "Не удалось отправить ссылку для входа.");
    else toast("Ссылка для входа отправлена на почту.");
  }

  function openImageDb() {
    if (!("indexedDB" in window)) return Promise.reject(new Error("В этом браузере недоступно хранилище изображений."));
    if (!imageDbPromise) {
      imageDbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open("mushroomsSveta-mechanics-images", 1);
        request.onupgradeneeded = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains("images")) db.createObjectStore("images", { keyPath: "key" });
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error || new Error("Не удалось открыть хранилище изображений."));
      });
    }
    return imageDbPromise;
  }

  async function imageDbRequest(mode, action, value) {
    const db = await openImageDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("images", mode);
      const store = transaction.objectStore("images");
      const request = action === "put" ? store.put(value) : action === "delete" ? store.delete(value) : store.get(value);
      let result;
      request.onsuccess = () => { result = request.result; };
      request.onerror = () => reject(request.error || new Error("Ошибка доступа к изображению."));
      transaction.oncomplete = () => resolve(result);
      transaction.onerror = () => reject(transaction.error || new Error("Ошибка доступа к изображению."));
      transaction.onabort = () => reject(transaction.error || new Error("Операция с изображением прервана."));
    });
  }

  async function putImage(blob) {
    const key = uid("image");
    await imageDbRequest("readwrite", "put", { key, blob });
    return key;
  }

  async function getImage(key) {
    if (!key) return null;
    const record = await imageDbRequest("readonly", "get", key);
    return record && record.blob ? record.blob : null;
  }

  async function removeImage(key) {
    if (!key) return;
    try {
      await imageDbRequest("readwrite", "delete", key);
    } catch (error) {
      console.warn("Не удалось удалить изображение", error);
    }
    if (imageUrls.has(key)) {
      URL.revokeObjectURL(imageUrls.get(key));
      imageUrls.delete(key);
    }
  }

  async function hydrateImages() {
    const keys = Array.from(new Set(state.items.flatMap(item => item.images.map(image => image.blobKey).filter(Boolean))));
    await Promise.all(keys.map(async key => {
      try {
        const blob = await getImage(key);
        if (blob && !imageUrls.has(key)) imageUrls.set(key, URL.createObjectURL(blob));
      } catch (error) {
        console.warn("Не удалось загрузить вложение", error);
      }
    }));
  }

  function imageSrc(image) {
    if (!image) return "";
    if (image.tempUrl) return image.tempUrl;
    if (image.blobKey) return imageUrls.get(image.blobKey) || image.src || "";
    return image.src || "";
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, character => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[character]);
  }

  function statusClass(status) {
    if (status === "В работе") return "status-work";
    if (status === "На тестировании") return "status-test";
    if (status === "Готово") return "status-ready";
    if (status === "В игре") return "status-live";
    return "status-idea";
  }

  function priorityClass(priority) {
    if (priority === "Высокий") return "priority-high";
    if (priority === "Низкий") return "priority-low";
    return "";
  }

  function imageMarkup(item, index) {
    const image = item.images[index];
    const src = imageSrc(image);
    if (!src) return `<div class="cover-placeholder" aria-hidden="true">${escapeHtml(item.icon || "✳")}</div>`;
    const focus = normalizeFocus(item.focus);
    return `<img class="cover-image" src="${escapeHtml(src)}" alt="" data-focus-x="${focus.x}" data-focus-y="${focus.y}" loading="lazy">`;
  }

  function positionCardImages() {
    $$(".card-cover .cover-image", elements.list).forEach(image => {
      const position = () => {
        const cover = image.closest(".card-cover");
        if (!cover || !image.naturalWidth || !cover.clientWidth || !cover.clientHeight) return;
        const width = cover.clientWidth * 3;
        const height = width * image.naturalHeight / image.naturalWidth;
        const focusX = Number(image.dataset.focusX) / 100;
        const focusY = Number(image.dataset.focusY) / 100;
        image.style.width = `${width}px`;
        image.style.height = `${height}px`;
        image.style.left = `${cover.clientWidth / 2 - focusX * width}px`;
        image.style.top = `${cover.clientHeight / 2 - focusY * height}px`;
      };
      if (image.complete) position();
      else image.addEventListener("load", position, { once: true });
    });
  }

  function renderOptions(select, values, firstLabel, selectedValue = "") {
    const distinct = Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b, "ru"));
    select.innerHTML = `<option value="">${escapeHtml(firstLabel)}</option>` + distinct.map(value =>
      `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(value)}</option>`
    ).join("");
  }

  function refreshFilterOptions() {
    const currentStatus = elements.status.value;
    const currentTag = elements.tag.value;
    renderOptions(elements.status, [...STATUSES, ...state.items.map(item => item.status)], "Все статусы", currentStatus);
    renderOptions(elements.tag, state.items.flatMap(item => item.tags), "Все теги", currentTag);
  }

  function filteredItems() {
    const query = elements.search.value.trim().toLocaleLowerCase("ru");
    const status = elements.status.value;
    const priority = elements.priority.value;
    const tag = elements.tag.value;
    const items = state.items.filter(item => {
      if (status && item.status !== status) return false;
      if (priority && item.priority !== priority) return false;
      if (tag && !item.tags.includes(tag)) return false;
      if (!query) return true;
      return [item.title, item.shortDescription, item.description, ...item.tags]
        .join(" ").toLocaleLowerCase("ru").includes(query);
    });
    const sort = elements.sort.value;
    items.sort((a, b) => {
      if (sort === "priority") return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1) || a.title.localeCompare(b.title, "ru");
      if (sort === "status") return (STATUS_ORDER[a.status] ?? 6) - (STATUS_ORDER[b.status] ?? 6) || (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1) || a.title.localeCompare(b.title, "ru");
      if (sort === "recent") return Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0) || a.title.localeCompare(b.title, "ru");
      if (sort === "appearance") {
        const levelA = normalizeLevel(a.appearanceLevel);
        const levelB = normalizeLevel(b.appearanceLevel);
        return (levelA === null ? Number.MAX_SAFE_INTEGER : levelA) - (levelB === null ? Number.MAX_SAFE_INTEGER : levelB)
          || a.title.localeCompare(b.title, "ru");
      }
      return a.title.localeCompare(b.title, "ru");
    });
    return items;
  }

  function renderList() {
    refreshFilterOptions();
    if (elements.total) elements.total.textContent = state.items.length;
    if (elements.ideas) elements.ideas.textContent = state.items.filter(item => item.source !== "Существующие механики").length;
    const items = filteredItems();
    if (elements.visible) elements.visible.textContent = items.length;
    if (elements.summary) elements.summary.innerHTML = items.length === state.items.length
      ? `<strong>${items.length}</strong> карточек в каталоге`
      : `<strong>${items.length}</strong> из <strong>${state.items.length}</strong> карточек`;
    elements.empty.hidden = items.length > 0;
    elements.list.hidden = items.length === 0;
    elements.list.innerHTML = items.map((item, index) => {
      const tags = item.tags.slice(0, 4).map(tag => `<button class="tag-chip tag-filter-chip" type="button" data-filter-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</button>`).join("");
      const extra = item.tags.length > 4 ? `<span class="tag-chip extra">+${item.tags.length - 4}</span>` : "";
      const level = normalizeLevel(item.appearanceLevel);
      return `<article class="mechanic-card${item.id === state.selectedId ? " is-selected" : ""}" data-item-id="${escapeHtml(item.id)}">
        <button class="card-cover" type="button" data-open-item="${escapeHtml(item.id)}" aria-label="Открыть: ${escapeHtml(item.title)}">${imageMarkup(item, 0)}<span class="cover-level" aria-label="Уровень ${level === null ? "не указан" : level}">${level === null ? "—" : level}</span></button>
        <div class="card-main">
          <div class="card-topline"><span class="status-pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span><span class="priority-pill ${priorityClass(item.priority)}">${escapeHtml(item.priority)}</span></div>
          <a class="card-title" href="#${encodeURIComponent(item.id)}" data-open-item="${escapeHtml(item.id)}">${escapeHtml(item.title || "Без названия")}</a>
          <p class="card-short-description">${escapeHtml(item.shortDescription || makeShortDescription(item.description))}</p>
          <div class="card-tags">${tags}${extra}</div>
        </div>
        <a class="card-open" href="#${encodeURIComponent(item.id)}" data-open-item="${escapeHtml(item.id)}" aria-label="Перейти к карточке ${escapeHtml(item.title)}">↗</a>
      </article>`;
    }).join("");
    positionCardImages();
  }

  function findItem(id) {
    return state.items.find(item => item.id === id);
  }

  function setHash(id) {
    const wanted = id ? `#${encodeURIComponent(id)}` : "";
    if (window.location.hash !== wanted) window.location.hash = wanted;
  }

  function openItem(id, writeHash = true) {
    const item = findItem(id);
    if (!item) return;
    state.selectedId = id;
    state.dialogMode = "view";
    state.draft = null;
    state.draftIsNew = false;
    renderList();
    renderDialog();
    if (!elements.dialog.open) elements.dialog.showModal();
    if (writeHash) setHash(id);
  }

  function newItem() {
    if (!canEditCatalog()) return;
    closeImageDialog();
    const item = {
      id: uid("mechanic"), title: "", description: "", shortDescription: "", tags: [], priority: "Средний",
      status: "На рассмотрении", source: "Пользовательская", origin: "Добавлена вручную", images: [],
      appearanceLevel: nextSyntheticLevel(), focus: { x: 50, y: 50 }, updatedAt: new Date().toISOString()
    };
    state.selectedId = item.id;
    state.draft = copy(item);
    state.draftIsNew = true;
    state.dialogMode = "edit";
    renderDialog();
    if (!elements.dialog.open) elements.dialog.showModal();
    setHash(item.id);
    window.setTimeout(() => $("#editTitle")?.focus(), 50);
  }

  function tagMarkup(tags) {
    return tags.length ? tags.map(tag => `<span class="tag-chip">${escapeHtml(tag)}</span>`).join("") : "";
  }

  function renderFocusPreview() {
    const picker = $("#focusPicker", elements.dialogContent);
    const draft = state.draft;
    if (!picker || !draft) return;
    draft.focus = normalizeFocus(draft.focus);
    const image = draft.images[0];
    const src = imageSrc(image);
    picker.disabled = !src;
    picker.innerHTML = src
      ? `<span class="focus-image-wrap"><img src="${escapeHtml(src)}" alt=""><span class="focus-crosshair" style="left:${draft.focus.x}%;top:${draft.focus.y}%"></span></span>`
      : `<span class="focus-empty">Добавь изображение, чтобы выбрать точку фокуса.</span>`;
    const x = $("#focusX", elements.dialogContent);
    const y = $("#focusY", elements.dialogContent);
    if (x) x.value = draft.focus.x;
    if (y) y.value = draft.focus.y;
  }

  function renderDetail(item) {
    const editDisabled = canEditCatalog() ? "" : ' disabled title="Войдите в аккаунт владельца, чтобы редактировать каталог"';
    const images = item.images.map((image, index) => {
      const src = imageSrc(image);
      if (!src) return "";
      return `<button class="detail-image" type="button" data-view-image="${index}" aria-label="Просмотреть изображение ${index + 1}"><img src="${escapeHtml(src)}" alt="${escapeHtml(item.title)} · изображение ${index + 1}" loading="lazy"></button>`;
    }).join("");
    elements.dialogContent.innerHTML = `<div class="detail-header">
      <p class="detail-eyebrow">КАРТОЧКА МЕХАНИКИ</p>
      <h2 class="detail-title" id="dialogTitle">${escapeHtml(item.title || "Без названия")}</h2>
      <div class="detail-pills"><span class="status-pill ${statusClass(item.status)}">${escapeHtml(item.status)}</span><span class="priority-pill ${priorityClass(item.priority)}">${escapeHtml(item.priority)}</span><span class="level-label">ур. ${normalizeLevel(item.appearanceLevel) === null ? "—" : normalizeLevel(item.appearanceLevel)}</span></div>
    </div>
    <p class="detail-description">${escapeHtml(item.description || "Описание пока не добавлено.")}</p>
    <div class="detail-tags">${tagMarkup(item.tags)}</div>
    ${images ? `<div class="detail-images">${images}</div>` : ""}
    ${item.images.length ? `<div class="detail-source">${item.images.length} ${item.images.length === 1 ? "изображение" : "изображения"}</div>` : ""}
    <div class="dialog-actions">
      <button class="button button-quiet" type="button" data-edit-item${editDisabled}>Редактировать</button>
      <button class="button button-quiet" type="button" data-duplicate-item${editDisabled}>Дублировать</button>
      <button class="button button-quiet" type="button" data-copy-link>Скопировать ссылку</button>
      <span class="spacer"></span>
      <button class="button button-danger" type="button" data-delete-item${editDisabled}>Удалить</button>
    </div>`;
    $$('[data-view-image]', elements.dialogContent).forEach(button => {
      button.addEventListener("click", () => showImage(item, Number(button.dataset.viewImage)));
    });
    $$("[data-edit-item]", elements.dialogContent).forEach(button => button.addEventListener("click", () => editItem(item.id)));
    $$("[data-duplicate-item]", elements.dialogContent).forEach(button => button.addEventListener("click", () => duplicateItem(item.id)));
    $$("[data-delete-item]", elements.dialogContent).forEach(button => button.addEventListener("click", () => deleteItem(item.id)));
    $$("[data-copy-link]", elements.dialogContent).forEach(button => button.addEventListener("click", copyItemLink));
  }

  function editorImageGrid() {
    const grid = $("#editImageGrid", elements.dialogContent);
    if (!grid || !state.draft) return;
    grid.innerHTML = state.draft.images.map((image, index) => {
      const src = imageSrc(image);
      const alt = image.name || `Изображение ${index + 1}`;
      return `<div class="edit-image"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"><button class="remove-image" type="button" data-remove-image="${index}" aria-label="Удалить изображение">×</button></div>`;
    }).join("");
    $$("[data-remove-image]", grid).forEach(button => button.addEventListener("click", () => {
      const index = Number(button.dataset.removeImage);
      const removed = state.draft.images.splice(index, 1)[0];
      if (removed && removed.tempUrl) {
        URL.revokeObjectURL(removed.tempUrl);
        temporaryUrls.delete(removed.tempUrl);
      }
      editorImageGrid();
    }));
    const count = $("#imageCount", elements.dialogContent);
    if (count) count.textContent = state.draft.images.length;
    renderFocusPreview();
  }

  function renderEditor(item) {
    const draft = state.draft || copy(item);
    const statusOptions = Array.from(new Set([...STATUSES, draft.status])).map(status => `<option value="${escapeHtml(status)}"${draft.status === status ? " selected" : ""}>${escapeHtml(status)}</option>`).join("");
    const priorityOptions = PRIORITIES.map(priority => `<option value="${priority}"${draft.priority === priority ? " selected" : ""}>${priority}</option>`).join("");
    elements.dialogContent.innerHTML = `<div class="detail-header">
      <p class="detail-eyebrow">${state.draftIsNew ? "НОВАЯ ЗАПИСЬ" : "РЕДАКТИРОВАНИЕ"}</p>
      <h2 class="detail-title" id="dialogTitle">${state.draftIsNew ? "Новая механика" : "Изменить карточку"}</h2>
    </div>
    <form class="editor-form" id="editorForm">
      <label>Заголовок<input id="editTitle" name="title" type="text" maxlength="140" placeholder="Например, водяное колесо" value="${escapeHtml(draft.title)}" required></label>
      <label>Краткое описание для списка<input id="editShortDescription" name="shortDescription" type="text" maxlength="180" placeholder="Коротко: что делает механика" value="${escapeHtml(draft.shortDescription || "")}"></label>
      <label>Описание<textarea id="editDescription" name="description" maxlength="5000" placeholder="Как работает механика и какой выбор она даёт игроку…">${escapeHtml(draft.description)}</textarea></label>
      <label>Теги<input id="editTags" name="tags" type="text" placeholder="вода, маршрут, награда" value="${escapeHtml(draft.tags.join(", "))}"><span class="editor-hint">Разделяй теги запятыми.</span></label>
      <div class="editor-row">
        <label>Статус<select id="editStatus" name="status">${statusOptions}</select></label>
        <label>Приоритет<select id="editPriority" name="priority">${priorityOptions}</select></label>
      </div>
      <label>Уровень появления в игре<input id="editAppearanceLevel" name="appearanceLevel" type="number" min="1" step="1" value="${normalizeLevel(draft.appearanceLevel) ?? ""}" placeholder="Например, 27"><span class="editor-hint">Для новых механик номер начинается с 99001.</span></label>
      <div>
        <div class="image-edit-heading"><span>Изображения</span><small><span id="imageCount">${draft.images.length}</span> шт.</small></div>
        <div class="paste-zone" id="pasteZone" tabindex="0" role="button" aria-label="Вставить или перетащить изображение">
          <span class="paste-icon" aria-hidden="true">▧</span><span><strong>Вставь изображение: Ctrl + V</strong><span>Можно также перетащить картинки сюда.</span></span>
        </div>
        <div class="upload-actions"><button class="button button-quiet" id="chooseImages" type="button">Добавить с компьютера</button></div>
        <input id="imageFiles" type="file" accept="image/*" multiple hidden>
        <div class="focus-setting">
          <div class="image-edit-heading"><span>Точка фокуса превью</span><small>кликни по нужной области</small></div>
          <button class="focus-picker" id="focusPicker" type="button" aria-label="Выбрать точку фокуса превью"></button>
          <div class="focus-controls">
            <label>По горизонтали <input id="focusX" type="range" min="0" max="100" step="1" value="${normalizeFocus(draft.focus).x}"></label>
            <label>По вертикали <input id="focusY" type="range" min="0" max="100" step="1" value="${normalizeFocus(draft.focus).y}"></label>
          </div>
          <p class="editor-hint">Эта точка будет в центре увеличенного превью карточки.</p>
        </div>
        <div class="edit-image-grid" id="editImageGrid"></div>
      </div>
      <div class="dialog-actions">
        <button class="button button-primary" type="submit">Сохранить</button>
        <button class="button button-quiet" id="cancelEdit" type="button">Отмена</button>
      </div>
    </form>`;
    editorImageGrid();
    const form = $("#editorForm", elements.dialogContent);
    form.addEventListener("input", () => { syncDraftFromForm(); renderFocusPreview(); });
    form.addEventListener("change", () => { syncDraftFromForm(); renderFocusPreview(); });
    form.addEventListener("submit", event => { event.preventDefault(); saveDraft(); });
    $("#cancelEdit", elements.dialogContent).addEventListener("click", cancelEdit);
    $("#chooseImages", elements.dialogContent).addEventListener("click", () => $("#imageFiles", elements.dialogContent).click());
    $("#imageFiles", elements.dialogContent).addEventListener("change", event => {
      addFilesToDraft(Array.from(event.target.files || []));
      event.target.value = "";
    });
    $("#focusPicker", elements.dialogContent).addEventListener("click", event => {
      const imageWrap = event.currentTarget.querySelector(".focus-image-wrap");
      if (!imageWrap) return;
      const bounds = imageWrap.getBoundingClientRect();
      state.draft.focus = normalizeFocus({
        x: (event.clientX - bounds.left) / bounds.width * 100,
        y: (event.clientY - bounds.top) / bounds.height * 100
      });
      renderFocusPreview();
    });
    const zone = $("#pasteZone", elements.dialogContent);
    zone.addEventListener("click", () => zone.focus());
    zone.addEventListener("dragover", event => { event.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", event => {
      event.preventDefault(); zone.classList.remove("drag-over");
      addFilesToDraft(Array.from(event.dataTransfer?.files || []));
    });
  }

  function syncDraftFromForm() {
    if (!state.draft) return;
    state.draft.title = $("#editTitle", elements.dialogContent).value;
    state.draft.shortDescription = $("#editShortDescription", elements.dialogContent).value;
    state.draft.description = $("#editDescription", elements.dialogContent).value;
    state.draft.tags = parseTags($("#editTags", elements.dialogContent).value);
    state.draft.status = $("#editStatus", elements.dialogContent).value;
    state.draft.priority = $("#editPriority", elements.dialogContent).value;
    state.draft.appearanceLevel = normalizeLevel($("#editAppearanceLevel", elements.dialogContent).value);
    state.draft.focus = normalizeFocus({
      x: $("#focusX", elements.dialogContent)?.value ?? state.draft.focus?.x,
      y: $("#focusY", elements.dialogContent)?.value ?? state.draft.focus?.y
    });
  }

  function parseTags(value) {
    return Array.from(new Set(String(value || "").split(",").map(tag => tag.trim()).filter(Boolean)));
  }

  function addFilesToDraft(files) {
    if (!state.draft) return;
    const accepted = files.filter(file => file && file.type && file.type.startsWith("image/"));
    if (!accepted.length) {
      if (files.length) toast("Добавь файл изображения: PNG, JPEG, WebP или другой формат картинки.");
      return;
    }
    accepted.forEach(file => {
      const tempUrl = URL.createObjectURL(file);
      temporaryUrls.add(tempUrl);
      state.draft.images.push({ id: uid("pending"), name: file.name || "Изображение из буфера", pendingBlob: file, tempUrl, type: "upload" });
    });
    editorImageGrid();
    toast(`${accepted.length} ${accepted.length === 1 ? "изображение добавлено" : "изображения добавлены"}. Сохрани карточку, чтобы оставить вложения.`);
  }

  function handleImagePaste(event) {
    if (!elements.dialog.open || state.dialogMode !== "edit" || !state.draft) return;
    const files = Array.from(event.clipboardData?.items || []).map(item => item.kind === "file" ? item.getAsFile() : null).filter(Boolean);
    if (!files.length) return;
    event.preventDefault();
    addFilesToDraft(files);
  }

  function compressImage(blob) {
    if (typeof createImageBitmap !== "function") return Promise.resolve(blob);
    return createImageBitmap(blob).then(bitmap => {
      const maxSide = 1800;
      const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const context = canvas.getContext("2d");
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      return new Promise(resolve => canvas.toBlob(result => resolve(result || blob), "image/webp", 0.88));
    }).catch(() => blob);
  }

  async function uploadCloudImage(blob) {
    if (!state.cloudConfigured) return {};
    const config = cloudConfig();
    const bucket = config.bucket || "mechanic-images";
    const extension = blob.type === "image/webp" ? "webp" : (blob.type.split("/")[1] || "bin");
    const path = `uploads/${uid("asset")}.${extension}`;
    const { data, error } = await state.cloudClient.storage.from(bucket).upload(path, blob, {
      cacheControl: "3600",
      contentType: blob.type || "application/octet-stream",
      upsert: false
    });
    if (error) throw error;
    const { data: publicData } = state.cloudClient.storage.from(bucket).getPublicUrl(data.path);
    return { storagePath: data.path, src: publicData.publicUrl };
  }

  async function storeDraftImages(images) {
    const stored = [];
    const addedKeys = [];
    try {
      for (const image of images) {
        if (image.pendingBlob) {
          const blob = await compressImage(image.pendingBlob);
          const blobKey = await putImage(blob);
          addedKeys.push(blobKey);
          imageUrls.set(blobKey, URL.createObjectURL(blob));
          const cloudImage = await uploadCloudImage(blob);
          stored.push({ id: image.id || uid("attached"), type: "upload", blobKey, name: image.name || "Изображение", ...cloudImage });
        } else {
          const { pendingBlob, tempUrl, ...saved } = image;
          stored.push(saved);
        }
      }
    } catch (error) {
      await Promise.all(addedKeys.map(removeImage));
      throw error;
    }
    return { images: stored, addedKeys };
  }

  function currentUploadKeys(item) {
    return (item?.images || []).map(image => image.blobKey).filter(Boolean);
  }

  async function saveDraft() {
    if (!canEditCatalog()) return;
    syncDraftFromForm();
    const title = state.draft.title.trim();
    if (!title) {
      $("#editTitle", elements.dialogContent).focus();
      toast("Добавь заголовок, чтобы сохранить карточку.");
      return;
    }
    const submit = $("#editorForm button[type='submit']", elements.dialogContent);
    submit.disabled = true;
    submit.textContent = "Сохраняю…";
    const original = findItem(state.selectedId);
    let addedKeys = [];
    try {
      const result = await storeDraftImages(state.draft.images);
      addedKeys = result.addedKeys;
      const next = cleanStoredItem({ ...state.draft, title, images: result.images, updatedAt: new Date().toISOString() });
      const index = state.items.findIndex(item => item.id === next.id);
      if (index < 0) state.items.unshift(next);
      else state.items[index] = next;
      if (!saveItems()) {
        if (index < 0) state.items.shift();
        else state.items[index] = original;
        await Promise.all(addedKeys.map(removeImage));
        return;
      }
      const retained = new Set(currentUploadKeys(next));
      await Promise.all(currentUploadKeys(original).filter(key => !retained.has(key)).map(removeImage));
      releaseTemporaryUrls();
      state.draft = null;
      state.dialogMode = "view";
      state.draftIsNew = false;
      state.selectedId = next.id;
      renderList();
      renderDialog();
      toast("Механика сохранена.");
    } catch (error) {
      console.error("Не удалось сохранить карточку", error);
      await Promise.all(addedKeys.map(removeImage));
      submit.disabled = false;
      submit.textContent = "Сохранить";
      toast(error.message || "Не удалось сохранить вложения.");
    }
  }

  function editItem(id) {
    if (!canEditCatalog()) return;
    const item = findItem(id);
    if (!item) return;
    state.selectedId = id;
    state.draft = copy(item);
    state.draftIsNew = false;
    state.dialogMode = "edit";
    renderDialog();
    $("#editTitle", elements.dialogContent)?.focus();
  }

  function releaseTemporaryUrls() {
    temporaryUrls.forEach(url => URL.revokeObjectURL(url));
    temporaryUrls.clear();
  }

  function cancelEdit() {
    if (state.draftIsNew) {
      closeDetail();
      return;
    }
    releaseTemporaryUrls();
    state.draft = null;
    state.dialogMode = "view";
    renderDialog();
  }

  async function duplicateItem(id) {
    if (!canEditCatalog()) return;
    const item = findItem(id);
    if (!item) return;
    const duplicate = copy(item);
    duplicate.id = uid("mechanic");
    duplicate.appearanceLevel = nextSyntheticLevel();
    duplicate.title = `${item.title} — копия`;
    duplicate.status = "На рассмотрении";
    duplicate.source = "Пользовательская";
    duplicate.origin = `Копия карточки «${item.title}»`;
    duplicate.tags = Array.from(new Set([...item.tags, "копия"]));
    duplicate.updatedAt = new Date().toISOString();
    const createdKeys = [];
    try {
      for (const image of duplicate.images) {
        if (!image.blobKey) continue;
        const blob = await getImage(image.blobKey);
        if (!blob) continue;
        const newKey = await putImage(blob);
        createdKeys.push(newKey);
        imageUrls.set(newKey, URL.createObjectURL(blob));
        image.blobKey = newKey;
        image.id = uid("attached");
      }
      state.items.unshift(cleanStoredItem(duplicate));
      if (!saveItems()) {
        state.items.shift();
        await Promise.all(createdKeys.map(removeImage));
        return;
      }
      renderList();
      openItem(duplicate.id);
      toast("Создана копия механики.");
    } catch (error) {
      await Promise.all(createdKeys.map(removeImage));
      toast(error.message || "Не удалось продублировать карточку.");
    }
  }

  async function deleteItem(id) {
    if (!canEditCatalog()) return;
    const item = findItem(id);
    if (!item) return;
    if (!window.confirm(`Удалить «${item.title}»? Это действие нельзя отменить.`)) return;
    const previousItems = state.items;
    state.items = state.items.filter(entry => entry.id !== id);
    state.deletedIds.add(id);
    if (!saveDeletedIds()) {
      state.items = previousItems;
      state.deletedIds.delete(id);
      return;
    }
    if (!saveItems()) {
      state.items = previousItems;
      state.deletedIds.delete(id);
      saveDeletedIds();
      return;
    }
    await Promise.all(currentUploadKeys(item).map(removeImage));
    closeDetail();
    renderList();
    toast("Карточка удалена.");
  }

  function renderDialog() {
    const item = state.draft || findItem(state.selectedId);
    if (!item) return;
    if (state.dialogMode === "edit") renderEditor(item);
    else renderDetail(item);
  }

  function closeDetail() {
    closeImageDialog();
    if (state.draft) releaseTemporaryUrls();
    state.draft = null;
    state.selectedId = null;
    state.dialogMode = "view";
    if (elements.dialog.open) elements.dialog.close();
    renderList();
    if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  function closeImageDialog() {
    if (elements.imageDialog.open) elements.imageDialog.close();
    state.imageToCopy = null;
  }

  function showImage(item, index) {
    const image = item.images[index];
    if (!image) return;
    const src = image.fullSrc || imageSrc(image);
    if (!src) {
      toast("Изображение ещё загружается.");
      return;
    }
    state.imageToCopy = image;
    elements.largeImage.src = src;
    elements.largeImage.alt = `${item.title} · изображение ${index + 1}`;
    elements.imageCaption.textContent = item.images.length > 1 ? `${item.title} · ${index + 1} из ${item.images.length}` : item.title;
    elements.copyImage.disabled = false;
    if (!elements.imageDialog.open) elements.imageDialog.showModal();
  }

  async function getImageBlob(image) {
    if (image.pendingBlob) return image.pendingBlob;
    if (image.blobKey) {
      const localBlob = await getImage(image.blobKey);
      if (localBlob) return localBlob;
    }
    const src = image.fullSrc || image.src;
    if (!src) return null;
    const response = await fetch(src);
    if (!response.ok) throw new Error("Не удалось загрузить изображение.");
    return response.blob();
  }

  async function copyImageToClipboard() {
    const button = elements.copyImage;
    if (!state.imageToCopy) return;
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      toast("Копирование доступно в браузере с разрешением на буфер обмена.");
      return;
    }
    button.disabled = true;
    try {
      const blob = await getImageBlob(state.imageToCopy);
      if (!blob) throw new Error("Не удалось получить изображение.");
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement("canvas");
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext("2d").drawImage(bitmap, 0, 0);
      bitmap.close();
      const png = await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
      if (!png) throw new Error("Не удалось подготовить изображение.");
      await navigator.clipboard.write([new ClipboardItem({ "image/png": png })]);
      toast("Изображение скопировано. Его можно вставить в другую карточку.");
    } catch (error) {
      console.error(error);
      toast("Браузер не разрешил скопировать изображение. Открой страницу по HTTPS и повтори.");
    } finally {
      button.disabled = false;
    }
  }

  async function copyItemLink() {
    const link = `${window.location.href.split("#")[0]}#${encodeURIComponent(state.selectedId)}`;
    try {
      await navigator.clipboard.writeText(link);
      toast("Ссылка на карточку скопирована.");
    } catch (_) {
      window.prompt("Скопируй ссылку на карточку:", link);
    }
  }

  function resetFilters() {
    elements.search.value = "";
    elements.status.value = "";
    elements.priority.value = "";
    elements.tag.value = "";
    elements.sort.value = "priority";
    renderList();
  }

  function toggleFilterFields() {
    const open = !elements.filterFields.classList.contains("is-open");
    elements.filterFields.classList.toggle("is-open", open);
    elements.filterFields.setAttribute("aria-hidden", String(!open));
    elements.filterFields.inert = !open;
    elements.filterToggle.setAttribute("aria-expanded", String(open));
  }

  function toast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => elements.toast.classList.remove("visible"), 3300);
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error || new Error("Не удалось прочитать изображение."));
      reader.readAsDataURL(blob);
    });
  }

  function downloadBackup(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function exportCatalog() {
    const button = $("#exportButton");
    if (button) button.disabled = true;
    const filename = `mechanics-backup-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    let fileHandle = null;

    try {
      if (typeof window.showSaveFilePicker === "function") {
        try {
          fileHandle = await window.showSaveFilePicker({
            id: "mechanicsBackup",
            suggestedName: filename,
            types: [{ description: "Резервная копия механик (JSON)", accept: { "application/json": [".json"] } }]
          });
        } catch (error) {
          if (error && error.name === "AbortError") return;
          console.warn("Не удалось открыть диалог выбора файла; используем загрузку.", error);
        }
      }

      const items = await Promise.all(state.items.map(async item => {
        const exported = cleanStoredItem(copy(item));
        exported.images = await Promise.all(exported.images.map(async image => {
          if (!image.blobKey) return image;
          const blob = await getImage(image.blobKey);
          if (!blob) throw new Error(`Не найдено изображение «${image.name || image.id}».`);
          const { blobKey, ...metadata } = image;
          return { ...metadata, inlineDataUrl: await blobToDataUrl(blob) };
        }));
        return exported;
      }));
      const backup = {
        format: "mushroomsSveta.mechanics-backup",
        version: 1,
        exportedAt: new Date().toISOString(),
        deletedIds: Array.from(state.deletedIds),
        items
      };
      const file = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json;charset=utf-8" });

      if (fileHandle) {
        try {
          const writable = await fileHandle.createWritable();
          await writable.write(file);
          await writable.close();
          toast("Резервная копия сохранена в выбранную папку.");
        } catch (error) {
          console.warn("Не удалось записать файл в выбранную папку; скачиваем копию.", error);
          downloadBackup(file, filename);
          toast("Не удалось записать в папку; копия скачана в браузере.");
        }
      } else {
        downloadBackup(file, filename);
        toast("Резервная копия скачана. Выбери папку проекта в загрузках браузера.");
      }
    } catch (error) {
      console.error("Не удалось выгрузить каталог механик", error);
      toast(error.message || "Не удалось выгрузить каталог.");
    } finally {
      if (button) button.disabled = false;
    }
  }

  async function importCatalogBackup(file) {
    if (!canEditCatalog()) return;
    if (!file) return;
    let backup;
    try {
      backup = JSON.parse(await file.text());
    } catch (_) {
      toast("Не удалось прочитать JSON-копию.");
      return;
    }
    if (backup?.format !== "mushroomsSveta.mechanics-backup" || !Array.isArray(backup.items)) {
      toast("Этот файл не похож на резервную копию механик.");
      return;
    }
    if (!window.confirm(`Загрузить ${backup.items.length} карточек из копии? Совпадающие карточки будут обновлены.`)) return;

    const previousItems = state.items;
    const previousDeleted = new Set(state.deletedIds);
    const storedItems = [];
    const addedKeys = [];
    try {
      for (const sourceItem of backup.items) {
        const item = copy(sourceItem);
        const images = [];
        for (const sourceImage of item.images || []) {
          if (!sourceImage.inlineDataUrl) {
            images.push(sourceImage);
            continue;
          }
          const response = await fetch(sourceImage.inlineDataUrl);
          const blob = await compressImage(await response.blob());
          const blobKey = await putImage(blob);
          addedKeys.push(blobKey);
          imageUrls.set(blobKey, URL.createObjectURL(blob));
          const { inlineDataUrl, ...metadata } = sourceImage;
          const cloudImage = await uploadCloudImage(blob);
          images.push({ ...metadata, type: "upload", blobKey, ...cloudImage });
        }
        storedItems.push(cleanStoredItem({ ...item, images }));
      }

      const merged = new Map(state.items.map(item => [item.id, item]));
      storedItems.forEach(item => {
        state.deletedIds.delete(item.id);
        merged.set(item.id, item);
      });
      (Array.isArray(backup.deletedIds) ? backup.deletedIds : []).forEach(id => state.deletedIds.add(String(id)));
      state.items = Array.from(merged.values()).filter(item => !state.deletedIds.has(item.id));
      if (!saveDeletedIds() || !saveItems()) throw new Error("Не удалось сохранить импортированные данные в браузере.");

      if (state.cloudReady && state.cloudOwner) {
        window.clearTimeout(state.cloudSaveTimer);
        await syncCloudCatalog();
      }
      renderList();
      if (state.selectedId && findItem(state.selectedId)) renderDialog();
      else if (state.selectedId) closeDetail();
      toast(`Загружено карточек: ${storedItems.length}.`);
    } catch (error) {
      state.items = previousItems;
      state.deletedIds = previousDeleted;
      saveDeletedIds();
      saveItems();
      await Promise.all(addedKeys.map(removeImage));
      console.error("Не удалось загрузить резервную копию", error);
      toast(error.message || "Не удалось загрузить резервную копию.");
    }
  }

  function handleListClick(event) {
    const tagButton = event.target.closest("[data-filter-tag]");
    if (tagButton) {
      event.preventDefault();
      event.stopPropagation();
      elements.tag.value = tagButton.dataset.filterTag;
      renderList();
      return;
    }
    const opener = event.target.closest("[data-open-item]");
    if (!opener) return;
    event.preventDefault();
    openItem(opener.dataset.openItem);
  }

  function handleHashChange() {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) {
      if (elements.dialog.open) {
        state.selectedId = null;
        state.draft = null;
        releaseTemporaryUrls();
        elements.dialog.close();
        renderList();
      }
      return;
    }
    if (findItem(id) && state.selectedId !== id) openItem(id, false);
  }

  function setupEvents() {
    [elements.search, elements.status, elements.priority, elements.tag, elements.sort].forEach(element => {
      element.addEventListener(element === elements.search ? "input" : "change", renderList);
    });
    elements.list.addEventListener("click", handleListClick);
    $("#newItemButton").addEventListener("click", newItem);
    $("#exportButton").addEventListener("click", exportCatalog);
    elements.importButton.addEventListener("click", () => elements.importFile.click());
    elements.importFile.addEventListener("change", () => {
      const [file] = elements.importFile.files || [];
      importCatalogBackup(file).finally(() => { elements.importFile.value = ""; });
    });
    elements.cloudLogin.addEventListener("click", handleCloudLogin);
    elements.filterToggle.addEventListener("click", toggleFilterFields);
    $("#emptyReset").addEventListener("click", resetFilters);
    $("#clearFilters").addEventListener("click", resetFilters);
    elements.dialog.addEventListener("click", event => {
      if (event.target.closest("[data-close-dialog]")) closeDetail();
    });
    elements.dialog.addEventListener("close", () => {
      if (state.draft) releaseTemporaryUrls();
      closeImageDialog();
      state.draft = null;
      state.selectedId = null;
      state.dialogMode = "view";
      if (window.location.hash) history.replaceState(null, "", window.location.pathname + window.location.search);
      renderList();
    });
    elements.imageDialog.addEventListener("click", event => {
      if (event.target.closest("[data-close-image]") || event.target === elements.imageDialog) closeImageDialog();
    });
    elements.copyImage.addEventListener("click", copyImageToClipboard);
    document.addEventListener("paste", handleImagePaste);
    window.addEventListener("hashchange", handleHashChange);
    document.addEventListener("keydown", event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        elements.search.focus();
        elements.search.select();
      }
    });
    window.addEventListener("resize", () => window.requestAnimationFrame(positionCardImages), { passive: true });
    window.addEventListener("beforeunload", releaseTemporaryUrls);
  }

  async function start() {
    loadItems();
    setupEvents();
    try {
      await initializeCloud();
    } catch (error) {
      console.error("Не удалось подключить общую базу Supabase", error);
      updateCloudControls();
      toast("Общая база пока недоступна. Проверьте настройки Supabase.");
    }
    await hydrateImages();
    renderList();
    if (window.location.hash) handleHashChange();
  }

  start();
})();
