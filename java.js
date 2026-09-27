const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const audioMenu = document.getElementById("audioMenu");

if (menuBtn && navLinks) {
	const closeMenu = () => {
		navLinks.classList.remove("active");
		menuBtn.setAttribute("aria-expanded", "false");
		menuBtn.setAttribute("aria-label", "Abrir menú");
	};

	menuBtn.addEventListener("click", () => {
		const isExpanded = menuBtn.getAttribute("aria-expanded") === "true";
		if (isExpanded) {
			closeMenu();
			return;
		}
		navLinks.classList.add("active");
		menuBtn.setAttribute("aria-expanded", "true");
		menuBtn.setAttribute("aria-label", "Cerrar menú");
	});

	navLinks.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", closeMenu);
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			if (audioMenu?.open) {
				audioMenu.open = false;
				audioMenu.querySelector("summary").focus();
			}
			if (menuBtn.getAttribute("aria-expanded") === "true") {
				closeMenu();
				menuBtn.focus();
			}
		}
	});

	document.addEventListener("click", (event) => {
		if (menuBtn.getAttribute("aria-expanded") === "true"
			&& !navLinks.contains(event.target)
			&& !menuBtn.contains(event.target)) {
			closeMenu();
		}
		if (audioMenu?.open && !audioMenu.contains(event.target)) {
			audioMenu.open = false;
		}
	});
}

const year = document.getElementById("year");
if (year) {
	year.textContent = new Date().getFullYear();
}

const soundToggle = document.getElementById("soundToggle");
const soundPreset = document.getElementById("soundPreset");
const soundVolume = document.getElementById("soundVolume");
const soundVolumeValue = document.getElementById("soundVolumeValue");
const soundStatus = document.getElementById("soundStatus");

if (soundToggle && soundPreset && soundVolume && soundVolumeValue && soundStatus) {
	const AudioContextClass = window.AudioContext || window.webkitAudioContext;
	let audioContext;
	const noiseBuffers = new Map();
	let masterGain;
	let highPass;
	let lowPass;
	let activeSource;
	let activeSourceGain;

	const updateVolume = () => {
		const volume = Number(soundVolume.value);
		soundVolumeValue.textContent = `${volume}%`;
		if (masterGain && audioContext) {
			masterGain.gain.setTargetAtTime(volume / 100 * 0.12, audioContext.currentTime, 0.15);
		}
	};

	const setPlaybackState = (isPlaying) => {
		soundToggle.setAttribute("aria-pressed", String(isPlaying));
		soundToggle.lastChild.textContent = isPlaying ? " Detener sonido" : " Activar sonido";
	};

	const createNoiseBuffer = (color) => {
		if (noiseBuffers.has(color)) return noiseBuffers.get(color);

		const buffer = audioContext.createBuffer(1, audioContext.sampleRate * 4, audioContext.sampleRate);
		const samples = buffer.getChannelData(0);
		let brownState = 0;
		let pink0 = 0;
		let pink1 = 0;
		let pink2 = 0;
		let pink3 = 0;
		let pink4 = 0;
		let pink5 = 0;
		let pink6 = 0;

		for (let index = 0; index < samples.length; index += 1) {
			const white = Math.random() * 2 - 1;
			if (color === "brown") {
				brownState = (brownState + 0.02 * white) / 1.02;
				samples[index] = brownState * 3.5;
			} else if (color === "pink") {
				pink0 = 0.99886 * pink0 + white * 0.0555179;
				pink1 = 0.99332 * pink1 + white * 0.0750759;
				pink2 = 0.969 * pink2 + white * 0.153852;
				pink3 = 0.8665 * pink3 + white * 0.3104856;
				pink4 = 0.55 * pink4 + white * 0.5329522;
				pink5 = -0.7616 * pink5 - white * 0.016898;
				const pink = pink0 + pink1 + pink2 + pink3 + pink4 + pink5 + pink6 + white * 0.5362;
				pink6 = white * 0.115926;
				samples[index] = pink * 0.11;
			} else {
				samples[index] = white;
			}
		}

		noiseBuffers.set(color, buffer);
		return buffer;
	};

	soundVolume.addEventListener("input", updateVolume);
	updateVolume();

	const startAmbientSound = async () => {
		if (!AudioContextClass) {
			throw new Error("Audio no compatible");
		}

		if (activeSource) return;

		if (!audioContext) {
				audioContext = new AudioContextClass();
				highPass = audioContext.createBiquadFilter();
				highPass.type = "highpass";
				highPass.frequency.value = 100;
				lowPass = audioContext.createBiquadFilter();
				lowPass.type = "lowpass";
				lowPass.frequency.value = 700;
				masterGain = audioContext.createGain();
				highPass.connect(lowPass);
				lowPass.connect(masterGain);
				masterGain.connect(audioContext.destination);
		}

		await audioContext.resume();
		if (audioContext.state !== "running") throw new Error("Reproducción automática bloqueada");
		const filterSettings = {
			soft: [100, 1000],
			pink: [45, 1700],
			brown: [25, 650]
		};
		const [highFrequency, lowFrequency] = filterSettings[soundPreset.value];
		highPass.frequency.setTargetAtTime(highFrequency, audioContext.currentTime, 0.2);
		lowPass.frequency.setTargetAtTime(lowFrequency, audioContext.currentTime, 0.2);

		const source = audioContext.createBufferSource();
		const sourceGain = audioContext.createGain();
		source.buffer = createNoiseBuffer(soundPreset.value);
		source.loop = true;
		sourceGain.gain.setValueAtTime(0, audioContext.currentTime);
		sourceGain.gain.setTargetAtTime(1, audioContext.currentTime, 0.8);
		source.connect(sourceGain);
		sourceGain.connect(highPass);
		source.start();
		activeSource = source;
		activeSourceGain = sourceGain;
		updateVolume();
		setPlaybackState(true);
	};

	soundPreset.addEventListener("change", async () => {
		const selectedName = soundPreset.selectedOptions[0].textContent;
		if (!activeSource) {
			soundStatus.textContent = `${selectedName} seleccionado. Pulsa «Activar sonido» para reproducirlo.`;
			return;
		}

		stopAmbientSound();
		try {
			await startAmbientSound();
			soundStatus.textContent = `Ambiente cambiado a: ${selectedName}.`;
		} catch {
			soundStatus.textContent = "No se pudo cambiar el sonido. Pulsa «Activar sonido» para intentarlo.";
		}
	});

	const stopAmbientSound = () => {
		if (!activeSource) return;
		const sourceToStop = activeSource;
		const gainToFade = activeSourceGain;
		activeSource = null;
		activeSourceGain = null;
		gainToFade.gain.setTargetAtTime(0, audioContext.currentTime, 0.12);
		window.setTimeout(() => {
			sourceToStop.stop();
			sourceToStop.disconnect();
			gainToFade.disconnect();
		}, 600);
		setPlaybackState(false);
	};

	soundToggle.addEventListener("click", async () => {
		if (activeSource) {
			stopAmbientSound();
			soundStatus.textContent = "Sonido detenido.";
			return;
		}

		try {
			await startAmbientSound();
			soundStatus.textContent = "Sonido ambiental activado. Ajusta el volumen a tu gusto.";
		} catch {
			soundStatus.textContent = AudioContextClass
				? "El navegador bloqueó el inicio automático. Vuelve a pulsar para activar el sonido."
				: "Este navegador no permite reproducir el sonido ambiental.";
		}
	});

	startAmbientSound().then(() => {
		soundStatus.textContent = "Sonido ambiental activado automáticamente. Ajusta el volumen a tu gusto.";
	}).catch(() => {
		soundStatus.textContent = AudioContextClass
			? "El navegador bloqueó el inicio automático. Pulsa «Activar sonido» para iniciar."
			: "Este navegador no permite reproducir el sonido ambiental.";
	});
}

if ("IntersectionObserver" in window) {
	const revealItems = document.querySelectorAll(
		".section-title, .about-content, .service-card, .process-step, .contact-info"
	);
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add("is-visible");
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12 });

	revealItems.forEach((item) => {
		item.classList.add("reveal");
		revealObserver.observe(item);
	});
}

