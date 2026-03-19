precision highp float;

uniform float u_time;
uniform vec3 u_color0;
uniform vec3 u_color1;
uniform vec3 u_color2;
varying vec3 vPosition;

vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 perm(vec4 x){ return mod289(((x * 25.0) + 1.0) * x); }

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main() {
    float frequency = 2.0;
    float distortion = 0.05;
    float speed = 0.2;

    vec3 pos = vPosition * frequency + vec3(
        distortion * sin(u_time),
        distortion * cos(u_time),
        u_time * speed
    );

    float n = noise(pos);
    n = pow(n, 2.0);

    float t = n * 3.0;
    float idx = floor(t);
    float f = fract(t);

    vec3 c0, c1;
    if (idx < 1.0) {
        c0 = u_color0;
        c1 = u_color1;
    } else if (idx < 2.0) {
        c0 = u_color1;
        c1 = u_color2;
    } else {
        c0 = u_color2;
        c1 = u_color0;
    }

    vec3 color = mix(c0, c1, f);
    gl_FragColor = vec4(color, 1.0);
}
