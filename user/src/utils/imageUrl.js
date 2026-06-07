export const getServerBaseUrl = () => {
	const apiBaseUrl =
		import.meta.env.VITE_SERVER_BASE_URL || "http://localhost:8080/api";
	return apiBaseUrl.replace(/\/api\/?$/, "");
};

export const resolveUploadUrl = (imagePath) => {
	if (!imagePath) return null;

	if (typeof imagePath === "string" && imagePath.startsWith("http")) {
		return imagePath;
	}

	const clean = String(imagePath).replace(/^\//, "").replace(/^uploads\//, "");
	return `${getServerBaseUrl()}/uploads/${clean}`;
};

const DEFAULT_GALLERIES = {
	hotel: [
		"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=450&fit=crop",
		"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop",
	],
	restaurant: [
		"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=450&fit=crop",
		"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
	],
	transport: [
		"https://images.unsplash.com/photo-1549924231-f129b911e442?w=800&h=450&fit=crop",
		"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop",
	],
	"trip-organizer": [
		"https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop",
		"https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
		"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=300&fit=crop",
	],
};

export const buildServiceImages = (apiImages, serviceType = "hotel") => {
	const uploaded = Array.isArray(apiImages)
		? apiImages.map(resolveUploadUrl).filter(Boolean)
		: [];

	const defaultGallery =
		DEFAULT_GALLERIES[serviceType] || DEFAULT_GALLERIES.hotel;
	const gallery = uploaded.length > 0 ? uploaded : defaultGallery;

	return {
		main: gallery[0],
		secondary: gallery.slice(1, 3),
		gallery,
	};
};

export const getServiceImageUrl = (item, serviceType = "hotel") => {
	if (item?.images && Array.isArray(item.images) && item.images.length > 0) {
		const resolved = resolveUploadUrl(item.images[0]);
		if (resolved) return resolved;
	}

	return (
		DEFAULT_GALLERIES[serviceType]?.[0] || DEFAULT_GALLERIES.hotel[0]
	);
};
