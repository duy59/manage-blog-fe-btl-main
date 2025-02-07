// UploadImageAdapter.js
class UploadImageAdapter {
  constructor(loader) {
      this.loader = loader;
      this.uploadedCallback = null; // Thêm callback để thông báo khi ảnh đã được tải lên
  }

  upload() {
      return this.loader.file
          .then(file => new Promise((resolve, reject) => {
            const data = new FormData();
            data.append('image', file);
            const token = sessionStorage.getItem('token');
            fetch(`${process.env.domainApi}/api/upload`, {
                method: 'POST',
                headers: {
                    'authorization': `${token}`
                },
                body: data
            }).then(response => response.json()).then(data => {
                if (this.uploadedCallback) {
                    this.uploadedCallback(data.url); // Gọi callback với URL của ảnh đã tải lên
                }
                resolve({
                    default: data.url
                });
            }).catch(error => reject(error));
          }));
  }

  abort() {
      // Implement abort functionality if needed
  }

  // Thêm phương thức để đăng ký callback
  onUploaded(callback) {
      this.uploadedCallback = callback;
  }
}

export default UploadImageAdapter;